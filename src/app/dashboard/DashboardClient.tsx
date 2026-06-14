"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardClient({ 
  user, 
  preferences, 
  reservations 
}: { 
  user: any; 
  preferences: any; 
  reservations: any[];
}) {
  const [isAI, setIsAI] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Good evening, ${user?.user_metadata?.first_name || 'Guest'}. How may I refine your dining calendar today?`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    track('ai_concierge_message_sent');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: "I apologize, but I am unable to connect to the concierge desk right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-8 min-h-screen px-margin-desktop max-w-container-max mx-auto grid grid-cols-12 gap-gutter pb-section-gap">
      {/* Main Content Area */}
      <section className="col-span-12 lg:col-span-8 py-stack-lg">
        <div className="mb-section-gap">
          <p className="font-label-caps text-label-caps text-secondary mb-2 tracking-widest uppercase">
            WELCOME BACK, {user?.user_metadata?.first_name || 'GUEST'}
          </p>
          <h1 className="font-display-lg text-display-lg text-primary mb-4">Your Table Awaits.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Manage your upcoming gastronomic experiences or browse through your history of exceptional evenings at Lumière.
          </p>
        </div>

        {/* Reservations Section */}
        <div className="space-y-stack-lg">
          <div className="flex justify-between items-end border-b border-outline-variant pb-stack-sm">
            <h2 className="font-headline-md text-headline-md text-primary">Your Reservations</h2>
            <div className="flex gap-4">
              <button className="text-secondary font-label-caps text-label-caps border-b border-secondary">UPCOMING</button>
              <button className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors">PAST</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {reservations?.length > 0 ? (
              reservations.map((res: any, idx: number) => (
                <div key={res.id || idx} className="bg-white dark:bg-surface-container-low luxury-shadow group overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDve96tsb4h3wVF59HlPRP_EB80WOoxd6jGUS4Pma6XDAi57xlV0S1vdZfIGGrC2YnIGg5K2oFQQ-vNiN69kOA7LOTzMPVjHqvf8hVW6wPdSUspbv-V2JEsIR4qggNfVNa4ntCccbF9mbZj_gp-ZeJO1ZyqwPFZTobsvq0avMPa8ir97SfEnCQ8PGxb973CkBGQkygDGCtdLTP52e8IN66ygfFWBez-m4Ya4Cy6c-nECwFTl8jhCcCKDZwLa9hRwkgEefilNttFXMc" alt="Reservation" />
                    <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase">{res.status || 'CONFIRMED'}</div>
                  </div>
                  <div className="p-stack-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-sm text-headline-sm">Lumière Reservation</h3>
                      <span className="material-symbols-outlined text-secondary">stars</span>
                    </div>
                    <div className="space-y-1 mb-6">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span className="font-body-md text-body-md">{res.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <span className="font-body-md text-body-md">{res.time} • {res.party_size || res.guests} Guests</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 border border-primary py-2 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">MANAGE</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-section-gap bg-surface-container-low border border-outline-variant">
                <p className="font-body-lg text-on-surface-variant mb-4">You have no upcoming reservations.</p>
                <button onClick={() => setIsAI(true)} className="text-secondary border-b border-secondary font-label-caps text-label-caps">BOOK WITH AI CONCIERGE</button>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Preferences */}
        <div className="mt-section-gap bg-surface-container-low p-stack-lg border border-outline-variant">
          <div className="flex items-start justify-between mb-stack-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm mb-1">Your Preferences</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Curating your experience based on your history.</p>
            </div>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {preferences?.dietary?.map((p: string) => (
              <span key={p} className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant uppercase">{p}</span>
            ))}
            {preferences?.seating?.map((p: string) => (
              <span key={p} className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant uppercase">{p}</span>
            ))}
            {preferences?.wine_pref?.map((p: string) => (
              <span key={p} className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant uppercase">{p}</span>
            ))}
            {(!preferences?.dietary?.length && !preferences?.seating?.length) && (
              <span className="text-on-surface-variant font-body-md italic">No preferences set yet. Tell your Maître d' AI what you like!</span>
            )}
          </div>
        </div>
      </section>

      {/* Right Side Panel */}
      <aside className="col-span-12 lg:col-span-4 py-stack-lg">
        <div className="bg-white dark:bg-surface-container-low border border-outline-variant luxury-shadow sticky top-[100px] overflow-hidden flex flex-col" id="side-panel">
          <div className="p-stack-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm">{isAI ? "Maître d' AI" : "New Reservation"}</h3>
              <p className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">{isAI ? "Personal Concierge" : "Standard Booking"}</p>
            </div>
            <span className={`material-symbols-outlined text-secondary ${isAI ? 'animate-pulse' : ''}`}>{isAI ? 'auto_fix_high' : 'calendar_month'}</span>
          </div>

          {!isAI ? (
            <div className="p-stack-md space-y-stack-md">
              <div>
                <label className="font-label-caps text-label-caps block mb-4">SELECT DATE</label>
                <div className="grid grid-cols-7 gap-2 text-center">
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">1</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">2</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">3</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">4</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">5</button>
                  <button className="p-2 bg-secondary text-white text-body-md">6</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">7</button>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-label-caps block mb-4">AVAILABLE TIMES</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">18:30</button>
                  <button className="border border-secondary bg-secondary/5 py-2 text-label-caps text-secondary">19:00</button>
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">19:30</button>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <button className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps tracking-widest hover:opacity-90 active:scale-95 transition-all mb-4">RESERVE TABLE</button>
                <div className="relative py-4 border-t border-outline-variant mt-stack-md">
                  <button 
                    onClick={() => setIsAI(true)}
                    className="w-full border border-secondary text-secondary py-4 font-label-caps text-label-caps tracking-widest flex items-center justify-center gap-3 hover:bg-secondary/5 transition-all">
                    <span className="material-symbols-outlined text-[20px]">temp_preferences_custom</span>
                    BOOK WITH AI
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-stack-md space-y-stack-md custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-low border border-outline-variant rounded-tl-none'} p-4 rounded-lg`}>
                      <p className="font-body-md leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-stack-md border-t border-outline-variant bg-surface-container-lowest">
                <div className="relative flex items-center">
                  <input 
                    className="w-full border-none border-b border-outline-variant focus:ring-0 focus:border-secondary bg-transparent py-4 pr-12 font-body-md italic" 
                    placeholder="Type your request..." 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="absolute right-0 p-2 text-secondary hover:scale-110 transition-transform disabled:opacity-50">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <button 
                  onClick={() => setIsAI(false)}
                  className="mt-4 text-[11px] font-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  BACK TO STANDARD BOOKING
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
