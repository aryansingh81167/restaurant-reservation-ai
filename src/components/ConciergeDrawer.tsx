"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function ConciergeDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    track("concierge_opened");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-margin-desktop right-margin-desktop z-30 bg-secondary text-white w-14 h-14 rounded-full flex items-center justify-center luxury-shadow hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>concierge</span>
      </button>

      <aside 
        className={`fixed right-0 top-0 h-screen w-full md:w-96 bg-surface-container-low shadow-md z-50 flex flex-col p-stack-lg overflow-y-auto no-scrollbar border-l border-outline-variant transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-section-gap">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">concierge</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-secondary">Virtual Concierge</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Personalized Dining Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-container-high transition-all rounded-full">
            <span className="material-symbols-outlined text-primary">close</span>
          </button>
        </div>
        <nav className="flex-1 space-y-stack-md">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center py-4 text-primary font-semibold border-l-4 border-secondary pl-4 hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined mr-4">chat_bubble</span>
            Concierge Chat
          </Link>
          <Link href="/menu" onClick={() => setIsOpen(false)} className="flex items-center py-4 text-on-surface-variant pl-4 hover:text-primary hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined mr-4">wine_bar</span>
            Wine List
          </Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center py-4 text-on-surface-variant pl-4 hover:text-primary hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined mr-4">settings</span>
            Preferences
          </Link>
          <Link href="#" className="flex items-center py-4 text-on-surface-variant pl-4 hover:text-primary hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined mr-4">help</span>
            Help Center
          </Link>
        </nav>
        <div className="mt-auto pt-stack-lg border-t border-outline-variant">
          <div className="bg-surface-container p-stack-md rounded mb-stack-md">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">LAST INQUIRY</p>
            <p className="font-body-md italic text-on-surface">"Looking for a quiet booth for two on Friday night..."</p>
          </div>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block text-center bg-primary text-on-primary py-4 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all">Start New Inquiry</Link>
        </div>
      </aside>

      {/* Overlay to catch clicks outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
