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
            <div className="flex gap-6">
              <button className="text-secondary font-label-caps text-label-caps uppercase tracking-widest relative group">
                UPCOMING
                <span className="absolute -bottom-[11px] left-0 w-full h-[2px] bg-secondary"></span>
              </button>
              <button className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors uppercase tracking-widest">PAST</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {reservations?.length > 0 ? (
              reservations.map((res: any, idx: number) => (
                <div key={res.id || idx} className="bg-white/50 backdrop-blur-sm dark:bg-surface-container-low luxury-shadow group overflow-hidden border border-outline-variant/30 hover:border-secondary/50 hover:shadow-2xl transition-all duration-500 rounded-sm flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDve96tsb4h3wVF59HlPRP_EB80WOoxd6jGUS4Pma6XDAi57xlV0S1vdZfIGGrC2YnIGg5K2oFQQ-vNiN69kOA7LOTzMPVjHqvf8hVW6wPdSUspbv-V2JEsIR4qggNfVNa4ntCccbF9mbZj_gp-ZeJO1ZyqwPFZTobsvq0avMPa8ir97SfEnCQ8PGxb973CkBGQkygDGCtdLTP52e8IN66ygfFWBez-m4Ya4Cy6c-nECwFTl8jhCcCKDZwLa9hRwkgEefilNttFXMc" alt="Reservation" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-md text-white px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase shadow-lg rounded-sm">{res.status || 'CONFIRMED'}</div>
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
                          <span className="font-body-md text-body-md">{res.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                          <span className="font-body-md text-body-md">{res.time} • {res.party_size || res.guests} Guests</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 border border-outline-variant py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 uppercase tracking-widest rounded-sm">MANAGE</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-section-gap bg-surface-container-low/50 backdrop-blur-sm border border-outline-variant/30 rounded-sm">
                <p className="font-body-lg text-on-surface-variant mb-6">You have no upcoming reservations.</p>
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
              <span className="text-on-surface-variant font-body-md italic opacity-70">No preferences set yet. Tell your Maître d' AI what you like!</span>
            )}
          </div>
        </div>
      </section>

      {/* Right Side Panel */}
      <aside className="col-span-12 lg:col-span-4 py-stack-lg">
        <div className="glass-panel rounded-sm shadow-2xl sticky top-[100px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }} id="side-panel">
          <div className="p-stack-md border-b border-outline-variant/20 bg-white/40 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">{isAI ? "Maître d' AI" : "New Reservation"}</h3>
              <p className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">{isAI ? "Personal Concierge" : "Standard Booking"}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAI ? 'bg-secondary/10' : 'bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-secondary ${isAI ? 'animate-pulse' : ''}`}>{isAI ? 'auto_fix_high' : 'calendar_month'}</span>
            </div>
          </div>

          {!isAI ? (
            <div className="p-stack-md space-y-stack-md">
              <div>
                <label className="font-label-caps text-label-caps block mb-4 text-on-surface-variant tracking-widest">SELECT DATE</label>
                <div className="grid grid-cols-7 gap-1 text-center">
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">1</button>
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">2</button>
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">3</button>
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">4</button>
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">5</button>
                  <button className="p-2 bg-secondary text-white text-body-md rounded-sm shadow-md">6</button>
                  <button className="p-2 hover:bg-white/50 text-primary text-body-md rounded-sm transition-colors">7</button>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-label-caps block mb-4 text-on-surface-variant tracking-widest">AVAILABLE TIMES</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="border border-outline-variant/30 bg-white/30 py-3 text-label-caps hover:border-secondary hover:bg-white/50 transition-all rounded-sm">18:30</button>
                  <button className="border border-secondary bg-secondary/10 py-3 text-label-caps text-secondary shadow-sm rounded-sm">19:00</button>
                  <button className="border border-outline-variant/30 bg-white/30 py-3 text-label-caps hover:border-secondary hover:bg-white/50 transition-all rounded-sm">19:30</button>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/20">
                <button className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps tracking-widest hover:bg-surface-tint active:scale-95 transition-all duration-300 mb-4 rounded-sm shadow-xl shadow-primary/10">RESERVE TABLE</button>
                <div className="relative py-4 border-t border-outline-variant/20 mt-stack-md">
                  <button 
                    onClick={() => setIsAI(true)}
                    className="w-full border border-secondary text-secondary py-4 font-label-caps text-label-caps tracking-widest flex items-center justify-center gap-3 hover:bg-secondary hover:text-white transition-all duration-300 rounded-sm">
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
                  <div key={i} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`} style={{ animationDuration: '0.4s' }}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' : 'bg-white/70 backdrop-blur-sm border border-outline-variant/20 rounded-tl-none shadow-sm'} p-4 rounded-xl max-w-[85%]`}>
                      <p className="font-body-md leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl rounded-tl-none border border-outline-variant/20 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-secondary/60 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-secondary/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-stack-md border-t border-outline-variant/20 bg-white/40 backdrop-blur-md">
                <div className="relative flex items-center bg-white/60 border border-outline-variant/30 rounded-full shadow-inner overflow-hidden focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all">
                  <input 
                    className="w-full bg-transparent py-3 pl-5 pr-12 font-body-md outline-none" 
                    placeholder="Type your request..." 
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
                    END SESSION
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
