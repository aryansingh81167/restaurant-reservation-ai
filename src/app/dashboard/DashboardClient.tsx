"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useRouter, useSearchParams } from "next/navigation";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Generate the next 14 days for the date picker
function getNextDays(count: number) {
  const days = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    // Skip Mondays (restaurant closed)
    if (d.getDay() === 1) continue;
    days.push({
      date: d.toISOString().split('T')[0],
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days.slice(0, count);
}

const AVAILABLE_TIMES = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function DashboardClient({ 
  user, 
  preferences, 
  reservations: initialReservations 
}: { 
  user: any; 
  preferences: any; 
  reservations: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAI, setIsAI] = useState(false);

  useEffect(() => {
    if (searchParams?.get('ai') === 'true') {
      setIsAI(true);
    }
  }, [searchParams]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState(2);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');
  const [reservations, setReservations] = useState(initialReservations);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const availableDays = getNextDays(14);

  const handleCancelReservation = async (id: string) => {
    if (!id) return;
    setCancellingId(id);
    try {
      const response = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to cancel');
      
      setReservations((prev: any[]) => prev.filter(r => r.id !== id));
      setConfirmCancelId(null);
      track('reservation_cancelled');
    } catch (error) {
      console.error('Cancellation failed', error);
      alert('Unable to cancel your reservation at this time. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  // Standard booking handler
  const handleReserve = async () => {
    if (!selectedDate || !selectedTime) return;
    setBookingStatus('loading');
    setBookingError('');
    track('standard_reservation_started');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          guests: selectedGuests,
          notes: [
            ...(preferences?.dietary || []),
            ...(preferences?.seating || []),
          ].join(', '),
        }),
      });

      const data = await response.json();

      if (data.success && data.reservation) {
        setBookingStatus('success');
        setReservations(prev => [data.reservation, ...prev]);
        track('standard_reservation_completed');
      } else {
        throw new Error(data.message || 'Booking failed');
      }
    } catch (err: any) {
      setBookingStatus('error');
      setBookingError(err.message || 'Unable to complete reservation.');
    }
  };

  // AI Chat State
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Good evening, ${user?.user_metadata?.first_name || 'Guest'}. I am your personal Maître d'. How may I assist you with your dining arrangements this evening?`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    setInputMessage("");
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);
    track('ai_concierge_message_sent');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: newMessages.slice(1), // skip the initial greeting
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        let replyContent = data.reply;

        // If booking was confirmed and saved, add a confirmation badge
        if (data.booking_saved && data.reservation_draft) {
          replyContent += `\n\n✓ Reservation saved: ${data.reservation_draft.date} at ${data.reservation_draft.time} for ${data.reservation_draft.guests} guests.`;
          // Refresh the reservations list
          router.refresh();
        }

        setMessages(prev => [...prev, { role: 'assistant', content: replyContent }]);
      } else if (data.error) {
        throw new Error(data.reply || 'Connection lost');
      } else {
        throw new Error('Invalid response');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I sincerely apologize, but I am unable to reach the concierge desk at this moment. Please try again shortly." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format a date string nicely
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 xl:gap-12 w-full h-full">
      {/* Main Content Area */}
      <section className="col-span-12 lg:col-span-7 xl:col-span-8">
        <div className="mb-section-gap animate-fade-in-up">
          <p className="font-label-caps text-label-caps text-secondary mb-2 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            WELCOME BACK, {user?.user_metadata?.first_name || 'GUEST'}
          </p>
          <h1 className="font-display-lg text-display-lg text-primary mb-4 drop-shadow-sm">Your Table Awaits.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Manage your upcoming gastronomic experiences or browse through your history of exceptional evenings at Lumière.
          </p>
        </div>

        {/* Reservations Section */}
        <div className="space-y-stack-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-stack-sm relative">
            <h2 className="font-headline-md text-headline-md text-primary">Your Reservations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {reservations?.length > 0 ? (
              reservations.map((res: any, idx: number) => (
                <div key={res.id || idx} className="bg-white/50 backdrop-blur-sm dark:bg-surface-container-low luxury-shadow group overflow-hidden border border-outline-variant/30 hover:border-secondary/50 hover:shadow-2xl transition-all duration-500 rounded-sm flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <Image fill className="object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDve96tsb4h3wVF59HlPRP_EB80WOoxd6jGUS4Pma6XDAi57xlV0S1vdZfIGGrC2YnIGg5K2oFQQ-vNiN69kOA7LOTzMPVjHqvf8hVW6wPdSUspbv-V2JEsIR4qggNfVNa4ntCccbF9mbZj_gp-ZeJO1ZyqwPFZTobsvq0avMPa8ir97SfEnCQ8PGxb973CkBGQkygDGCtdLTP52e8IN66ygfFWBez-m4Ya4Cy6c-nECwFTl8jhCcCKDZwLa9hRwkgEefilNttFXMc" alt="Fine dining at Lumière" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`absolute top-4 right-4 backdrop-blur-md text-white px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase shadow-lg rounded-sm ${res.status === 'confirmed' ? 'bg-secondary/90' : res.status === 'cancelled' ? 'bg-red-500/90' : 'bg-secondary/90'}`}>{res.status || 'CONFIRMED'}</div>
                  </div>
                  <div className="p-stack-md flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline-sm text-headline-sm text-primary">Lumière Reservation</h3>
                        <span className="material-symbols-outlined text-secondary group-hover:rotate-12 transition-transform duration-500">stars</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-3 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px] text-secondary">calendar_today</span>
                          <span className="font-body-md text-body-md">{formatDate(res.date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                          <span className="font-body-md text-body-md">{res.time} · {res.party_size || res.guests || 2} Guests</span>
                        </div>
                        {res.notes && (
                          <div className="flex items-center gap-3 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px] text-secondary">sticky_note_2</span>
                            <span className="font-body-md text-body-md truncate">{res.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {confirmCancelId === res.id ? (
                        <div className="flex-1 flex gap-2">
                          <button 
                            onClick={() => handleCancelReservation(res.id)}
                            disabled={cancellingId === res.id}
                            className="flex-1 bg-error text-on-error py-3 font-label-caps text-label-caps hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50">
                            {cancellingId === res.id ? 'CANCELLING...' : 'CONFIRM'}
                          </button>
                          <button 
                            onClick={() => setConfirmCancelId(null)}
                            disabled={cancellingId === res.id}
                            className="flex-1 border border-outline-variant py-3 font-label-caps text-label-caps hover:bg-surface-container rounded-sm disabled:opacity-50">
                            BACK
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmCancelId(res.id)}
                          className="flex-1 border border-outline-variant py-3 font-label-caps text-label-caps hover:bg-error-container hover:text-on-error-container hover:border-error transition-all duration-300 uppercase tracking-widest rounded-sm text-center">
                          CANCEL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-section-gap bg-surface-container-low/50 backdrop-blur-sm border border-outline-variant/30 rounded-sm">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-4 block">restaurant</span>
                <p className="font-body-lg text-on-surface-variant mb-6">No reservations yet.</p>
                <button onClick={() => setIsAI(true)} className="text-secondary border-b border-secondary pb-1 font-label-caps text-label-caps hover:text-primary hover:border-primary transition-colors tracking-widest uppercase">BOOK WITH AI CONCIERGE</button>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Preferences */}
        <div className="mt-section-gap glass-panel p-stack-lg rounded-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-stack-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm mb-1 text-primary">Your Preferences</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Curating your experience based on your history.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {preferences?.dietary?.map((p: string) => (
              <span key={p} className="bg-white/60 dark:bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant/30 uppercase text-primary shadow-sm hover:border-secondary transition-colors cursor-default">{p}</span>
            ))}
            {preferences?.seating?.map((p: string) => (
              <span key={p} className="bg-white/60 dark:bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant/30 uppercase text-primary shadow-sm hover:border-secondary transition-colors cursor-default">{p}</span>
            ))}
            {preferences?.wine_pref?.map((p: string) => (
              <span key={p} className="bg-white/60 dark:bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant/30 uppercase text-primary shadow-sm hover:border-secondary transition-colors cursor-default">{p}</span>
            ))}
            {(!preferences?.dietary?.length && !preferences?.seating?.length) && (
              <span className="text-on-surface-variant font-body-md italic opacity-70">No preferences set yet. Tell your Maître d&apos; AI what you like!</span>
            )}
          </div>
        </div>
      </section>

      {/* Right Side Panel */}
      <aside className="col-span-12 lg:col-span-5 xl:col-span-4">
        <div className="glass-panel rounded-sm shadow-2xl sticky top-[80px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }} id="side-panel">
          <div className="p-stack-md border-b border-outline-variant/20 bg-white/40 dark:bg-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">{isAI ? "Maître d' AI" : "New Reservation"}</h3>
              <p className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">{isAI ? "Personal Concierge" : "Standard Booking"}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAI ? 'bg-secondary/10' : 'bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-secondary ${isAI ? 'animate-pulse' : ''}`}>{isAI ? 'auto_fix_high' : 'calendar_month'}</span>
            </div>
          </div>

          {!isAI ? (
            <div className="p-stack-md space-y-stack-md overflow-y-auto max-h-[600px] custom-scrollbar">
              {bookingStatus === 'success' ? (
                <div className="py-12 flex flex-col items-center text-center animate-fade-in">
                  <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Reservation Confirmed</h3>
                  <p className="font-body-md text-on-surface-variant mb-2">
                    {selectedDate && formatDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="font-body-md text-on-surface-variant mb-8">{selectedGuests} guests</p>
                  <button 
                    onClick={() => { setBookingStatus('idle'); setSelectedDate(null); setSelectedTime(null); setSelectedGuests(2); }}
                    className="border border-outline-variant py-3 px-8 font-label-caps text-label-caps hover:bg-surface-container transition-all rounded-sm">
                    BOOK ANOTHER
                  </button>
                </div>
              ) : (
                <>
                  {/* Date Picker */}
                  <div>
                    <label className="font-label-caps text-label-caps block mb-4 text-on-surface-variant tracking-widest">SELECT DATE</label>
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      {availableDays.slice(0, 8).map(day => (
                        <button 
                          key={day.date}
                          onClick={() => setSelectedDate(day.date)}
                          className={`p-2 rounded-sm transition-all flex flex-col items-center ${selectedDate === day.date ? 'bg-secondary text-white shadow-md scale-105' : 'hover:bg-white/50 dark:hover:bg-white/10 text-primary dark:text-on-surface border border-outline-variant/20'}`}>
                          <span className="text-[10px] font-label-caps opacity-70">{day.dayOfWeek}</span>
                          <span className="text-body-md font-semibold">{day.dayNum}</span>
                          <span className="text-[9px] font-label-caps opacity-50">{day.month}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div>
                    <label className="font-label-caps text-label-caps block mb-4 text-on-surface-variant tracking-widest">SELECT TIME</label>
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      {AVAILABLE_TIMES.map(time => (
                        <button 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 text-label-caps rounded-sm transition-all text-center ${selectedTime === time ? 'border border-secondary bg-secondary/10 text-secondary shadow-sm' : 'border border-outline-variant/30 bg-white/30 dark:bg-white/5 hover:border-secondary hover:bg-white/50 dark:hover:bg-white/10'}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="font-label-caps text-label-caps block mb-4 text-on-surface-variant tracking-widest">PARTY SIZE</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                      {GUEST_OPTIONS.map(num => (
                        <button 
                          key={num}
                          onClick={() => setSelectedGuests(num)}
                          className={`p-2 rounded-sm transition-all text-body-md text-center ${selectedGuests === num ? 'bg-secondary text-white shadow-md' : 'hover:bg-white/50 dark:hover:bg-white/10 text-primary dark:text-on-surface border border-outline-variant/20'}`}>
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {bookingStatus === 'error' && (
                    <div className="p-3 bg-error-container border border-error text-on-error-container text-sm font-body rounded transition-colors animate-fade-in">
                      {bookingError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-outline-variant/20">
                    <button 
                      onClick={handleReserve}
                      disabled={bookingStatus === 'loading' || !selectedDate || !selectedTime}
                      className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps tracking-widest hover:bg-surface-tint active:scale-95 transition-all duration-300 mb-4 rounded-sm shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookingStatus === 'loading' ? (
                        <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> RESERVING...</>
                      ) : 'RESERVE TABLE'}
                    </button>
                    <div className="relative py-3 border-t border-outline-variant/20">
                      <button 
                        onClick={() => setIsAI(true)}
                        className="w-full border border-secondary text-secondary py-4 font-label-caps text-label-caps tracking-widest flex items-center justify-center gap-3 hover:bg-secondary hover:text-white transition-all duration-300 rounded-sm">
                        <span className="material-symbols-outlined text-[20px]">temp_preferences_custom</span>
                        BOOK WITH AI
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-[500px]">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-stack-md space-y-stack-md custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`} style={{ animationDuration: '0.4s' }}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' : 'bg-white/70 dark:bg-surface-container-low backdrop-blur-sm border border-outline-variant/20 rounded-tl-none shadow-sm'} p-4 rounded-xl max-w-[85%]`}>
                      <p className="font-body-md leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                    </div>
                    <div className="bg-white/70 dark:bg-surface-container-low backdrop-blur-sm p-4 rounded-xl rounded-tl-none border border-outline-variant/20 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-secondary/60 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-secondary/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}

              </div>

              <div className="p-stack-md border-t border-outline-variant/20 bg-white/40 dark:bg-white/5 backdrop-blur-md">
                <div className="relative flex items-center bg-white/60 dark:bg-surface-container border border-outline-variant/30 rounded-full shadow-inner overflow-hidden focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all">
                  <input 
                    className="w-full bg-transparent py-3 pl-5 pr-12 font-body-md outline-none text-on-surface" 
                    placeholder="Book a table for Friday at 8pm..." 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="absolute right-2 p-2 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-white hover:bg-secondary-container hover:text-secondary transition-all disabled:opacity-50 disabled:hover:bg-secondary disabled:hover:text-white">
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setIsAI(false)}
                    className="text-[11px] font-label-caps text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1 uppercase tracking-widest px-3 py-1 rounded-full hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    STANDARD BOOKING
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
