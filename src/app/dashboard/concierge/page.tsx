"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { track } from "@vercel/analytics";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  draft?: {
    date: string;
    time: string;
    guests: number;
    notes: string;
  };
};

export default function ConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonsoir. I am your Maître d' AI. How may I assist you with your dining experience today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: "default" })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        draft: data.reservation_draft
      };

      setMessages((prev: Message[]) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I am currently unable to process your request. Please try again shortly.",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmDraft = async (draft: {date: string; time: string; guests: number; notes: string;}) => {
    setIsTyping(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('reservations').insert({
        user_id: user.id,
        date: draft.date,
        time: draft.time,
        guests: draft.guests,
        notes: draft.notes,
        status: 'confirmed'
      });
      
      track("booking_completed");
      
      setMessages((prev: Message[]) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Your reservation has been confirmed. We look forward to welcoming you to LUMIÈRE.",
        timestamp: new Date()
      }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-surface">
      {/* Header */}
      <header className="h-20 border-b border-outline-variant/30 flex items-center justify-between px-6 shrink-0 bg-surface z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-display text-2xl text-primary leading-none">Maître d' AI</h1>
            <span className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b3022]"></span>
              <span className="font-label-caps text-[10px] text-outline">Online</span>
            </span>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => handleSend("View Skyline Spots")} className="font-label-caps text-[10px] px-3 py-1.5 border border-outline-variant/50 rounded hover:bg-surface-container transition-colors">View Skyline Spots</button>
          <button onClick={() => handleSend("My Preferences")} className="font-label-caps text-[10px] px-3 py-1.5 border border-outline-variant/50 rounded hover:bg-surface-container transition-colors">My Preferences</button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8 pb-4">
          <div className="text-center">
            <span className="font-label-caps text-xs text-outline-variant">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] p-5 ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-l-lg rounded-tr-lg' : 'bg-surface-container-low border border-outline-variant/20 rounded-r-lg rounded-tl-lg shadow-sm'}`}>
                {msg.role === 'assistant' && (
                  <span className="font-display text-sm text-secondary mb-2 block">Maître d'</span>
                )}
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.draft && (
                  <div className="mt-4 p-4 border border-secondary/30 bg-surface rounded">
                    <h4 className="font-label-caps text-xs text-primary mb-2">Reservation Draft</h4>
                    <ul className="space-y-1 font-body text-sm text-on-surface-variant mb-4">
                      <li><strong>Date:</strong> {msg.draft.date}</li>
                      <li><strong>Time:</strong> {msg.draft.time}</li>
                      <li><strong>Guests:</strong> {msg.draft.guests}</li>
                      {msg.draft.notes && <li><strong>Notes:</strong> {msg.draft.notes}</li>}
                    </ul>
                    <button 
                      onClick={() => handleConfirmDraft(msg.draft!)}
                      className="w-full py-2 bg-secondary text-on-secondary font-interactive text-xs uppercase tracking-widest rounded hover:bg-secondary-fixed-dim transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                )}
              </div>
              <span className="font-label-caps text-[10px] text-outline-variant mt-2 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-r-lg rounded-tl-lg p-5 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-outline-variant/30 bg-surface p-6 pb-8 shrink-0">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Request a table, update preferences, or ask a question..."
              className="w-full bg-transparent border-b border-outline-variant py-4 pr-12 focus:outline-none focus:border-secondary font-body text-primary placeholder-outline transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-secondary disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">send</span>
            </button>
          </form>
          <div className="text-center mt-6">
            <span className="font-label-caps text-[9px] text-outline-variant tracking-[0.15em]">
              ENCRYPTED END-TO-END CONCIERGE SERVICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
