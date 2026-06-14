"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function DashboardPage() {
  const [isAI, setIsAI] = useState(false);

  return (
    <div className="pt-8 min-h-screen px-margin-desktop max-w-container-max mx-auto grid grid-cols-12 gap-gutter pb-section-gap">
      {/* Main Content Area (8 Columns) */}
      <section className="col-span-12 lg:col-span-8 py-stack-lg">
        <div className="mb-section-gap">
          <p className="font-label-caps text-label-caps text-secondary mb-2 tracking-widest">WELCOME BACK, ALEXANDER</p>
          <h1 className="font-display-lg text-display-lg text-primary mb-4">Your Table Awaits.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Manage your upcoming gastronomic experiences or browse through your history of exceptional evenings at Lumière.</p>
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

          {/* Reservation Cards (Bento/Modern Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {/* Card 1 */}
            <div className="bg-white dark:bg-surface-container-low luxury-shadow group overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDve96tsb4h3wVF59HlPRP_EB80WOoxd6jGUS4Pma6XDAi57xlV0S1vdZfIGGrC2YnIGg5K2oFQQ-vNiN69kOA7LOTzMPVjHqvf8hVW6wPdSUspbv-V2JEsIR4qggNfVNa4ntCccbF9mbZj_gp-ZeJO1ZyqwPFZTobsvq0avMPa8ir97SfEnCQ8PGxb973CkBGQkygDGCtdLTP52e8IN66ygfFWBez-m4Ya4Cy6c-nECwFTl8jhCcCKDZwLa9hRwkgEefilNttFXMc" alt="Restaurant Interior" />
                <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 font-label-caps text-[10px] tracking-widest">CONFIRMED</div>
              </div>
              <div className="p-stack-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-headline-sm">Chef's Table Experience</h3>
                  <span className="material-symbols-outlined text-secondary">stars</span>
                </div>
                <div className="space-y-1 mb-6">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span className="font-body-md text-body-md">Saturday, Nov 16, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-body-md text-body-md">20:30 • 4 Guests</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 border border-primary py-2 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">MANAGE</button>
                  <button className="p-2 border border-outline-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-surface-container-low luxury-shadow group overflow-hidden border border-outline-variant hover:border-secondary transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKYcJk5quXPY_zd-g9JkjfgnknRdPoVYubb_Gctrs2hZb8HC-aUZclCXy5buM61g8CdJaeiqejdwjKAPIZ2lwiKnur4rGc0NnM8xTCOUJ5rEfWxMgQR49EE5SKqQIKh47NaGFIkKWI450UNiLYYMwh1BSglCQObx5qwigOSIWMlLKbU0uIc30ZtZaQt1hXovdclWB-OqzsHNhef08OMB5ZpwJreHBGfoDi0yG5Ho_XAUrZUVTiI5T3xQ6r13RFkTYFdkm5mCAzih0" alt="Cocktail" />
                <div className="absolute top-4 right-4 bg-surface-container-highest text-on-surface px-3 py-1 font-label-caps text-[10px] tracking-widest">PENDING</div>
              </div>
              <div className="p-stack-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-headline-sm">Terrace Sunset Tasting</h3>
                  <span className="material-symbols-outlined text-on-surface-variant">wb_sunny</span>
                </div>
                <div className="space-y-1 mb-6">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span className="font-body-md text-body-md">Friday, Dec 01, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-body-md text-body-md">17:00 • 2 Guests</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 border border-primary py-2 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">MANAGE</button>
                  <button className="p-2 border border-outline-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>
            </div>
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
            <span className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant">PESCATARIAN</span>
            <span className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant">BOOTH SEATING</span>
            <span className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant">CHARDONNAY PREFERENCE</span>
            <span className="bg-surface-container-highest px-4 py-2 font-label-caps text-label-caps rounded-full border border-outline-variant">QUIET TABLE</span>
          </div>
        </div>
      </section>

      {/* Right Side Panel (4 Columns) - Booking & AI Concierge */}
      <aside className="col-span-12 lg:col-span-4 py-stack-lg">
        <div className="bg-white dark:bg-surface-container-low border border-outline-variant luxury-shadow sticky top-[100px] overflow-hidden flex flex-col" id="side-panel">
          {/* Panel Header */}
          <div className="p-stack-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm">{isAI ? "Maître d' AI" : "New Reservation"}</h3>
              <p className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">{isAI ? "Personal Concierge" : "Standard Booking"}</p>
            </div>
            <span className={`material-symbols-outlined text-secondary ${isAI ? 'animate-pulse' : ''}`}>{isAI ? 'auto_fix_high' : 'calendar_month'}</span>
          </div>

          {/* Content Area */}
          {!isAI ? (
            <div className="p-stack-md space-y-stack-md">
              {/* Date Picker Simulation */}
              <div>
                <label className="font-label-caps text-label-caps block mb-4">SELECT DATE</label>
                <div className="grid grid-cols-7 gap-2 text-center">
                  <span className="text-on-surface-variant text-[11px] font-medium">S</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">M</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">T</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">W</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">T</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">F</span>
                  <span className="text-on-surface-variant text-[11px] font-medium">S</span>
                  <button className="p-2 text-on-surface-variant opacity-30 text-body-md">27</button>
                  <button className="p-2 text-on-surface-variant opacity-30 text-body-md">28</button>
                  <button className="p-2 text-on-surface-variant opacity-30 text-body-md">29</button>
                  <button className="p-2 text-on-surface-variant opacity-30 text-body-md">30</button>
                  <button className="p-2 text-on-surface-variant opacity-30 text-body-md">31</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">1</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">2</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">3</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">4</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">5</button>
                  <button className="p-2 bg-secondary text-white text-body-md">6</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">7</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">8</button>
                  <button className="p-2 hover:bg-surface-container text-primary text-body-md">9</button>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="font-label-caps text-label-caps block mb-4">AVAILABLE TIMES</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">18:30</button>
                  <button className="border border-secondary bg-secondary/5 py-2 text-label-caps text-secondary">19:00</button>
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">19:30</button>
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">20:00</button>
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">20:30</button>
                  <button className="border border-outline-variant py-2 text-label-caps hover:border-secondary transition-colors">21:00</button>
                </div>
              </div>

              {/* Guests Selection */}
              <div className="pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-label-caps text-label-caps">GUESTS</span>
                  <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">-</button>
                    <span className="font-headline-sm">2</span>
                    <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">+</button>
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps tracking-widest hover:opacity-90 active:scale-95 transition-all mb-4">RESERVE TABLE</button>

                {/* AI Toggle Button */}
                <div className="relative py-4 border-t border-outline-variant mt-stack-md">
                  <button 
                    onClick={() => setIsAI(true)}
                    className="w-full border border-secondary text-secondary py-4 font-label-caps text-label-caps tracking-widest flex items-center justify-center gap-3 hover:bg-secondary/5 transition-all">
                    <span className="material-symbols-outlined text-[20px]">temp_preferences_custom</span>
                    BOOK WITH AI
                  </button>
                  <p className="text-[10px] text-center text-on-surface-variant mt-3 font-body-md uppercase tracking-tighter">Instant availability &amp; curated requests via Maître d' AI</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-stack-md space-y-stack-md custom-scrollbar">
                {/* Message from AI */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-[16px]">support_agent</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg rounded-tl-none border border-outline-variant">
                    <p className="font-display-lg text-body-md leading-relaxed">Good evening, Alexander. I see you're looking at Nov 6th. Would you like me to find a quiet table near the window as per your preference?</p>
                  </div>
                </div>

                {/* Message from User */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-on-primary p-4 rounded-lg rounded-tr-none">
                    <p className="font-body-md leading-relaxed">Yes, please. Also, can we ensure the tasting menu includes a pescatarian option?</p>
                  </div>
                </div>

                {/* AI Typing */}
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
              </div>

              {/* Input */}
              <div className="p-stack-md border-t border-outline-variant bg-surface-container-lowest">
                <div className="relative flex items-center">
                  <input className="w-full border-none border-b border-outline-variant focus:ring-0 focus:border-secondary bg-transparent py-4 pr-12 font-body-md italic" placeholder="Type your request..." type="text" />
                  <button className="absolute right-0 p-2 text-secondary hover:scale-110 transition-transform">
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
