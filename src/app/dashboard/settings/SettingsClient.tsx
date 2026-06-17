"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsClient({ user, initialPreferences }: { user: any, initialPreferences: any }) {
  const router = useRouter();
  const [dietary, setDietary] = useState<string>(initialPreferences?.dietary?.join(', ') || '');
  const [seating, setSeating] = useState<string>(initialPreferences?.seating?.join(', ') || '');
  const [winePref, setWinePref] = useState<string>(initialPreferences?.wine_pref?.join(', ') || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  const email = user.email || '';
  const phone = user.phone || user.user_metadata?.phone || 'Not provided';

  const handleSave = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietary: dietary.split(',').map(s => s.trim()).filter(Boolean),
          seating: seating.split(',').map(s => s.trim()).filter(Boolean),
          wine_pref: winePref.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      setStatus('success');
      router.refresh();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-8 min-h-screen px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col gap-gutter pb-section-gap">
      <div className="mb-section-gap animate-fade-in-up mt-24">
        <Link href="/dashboard" className="text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-4 font-label-caps text-label-caps uppercase tracking-widest w-fit">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Dashboard
        </Link>
        <h1 className="font-display-lg text-display-lg text-primary mb-4 drop-shadow-sm">Account Settings</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Manage your personal information and dining preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Profile Card */}
        <div className="glass-panel p-stack-lg rounded-sm h-fit">
          <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/30 pb-4">Profile Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Full Name</label>
              <p className="font-body-lg text-primary">{firstName} {lastName}</p>
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Email Address</label>
              <p className="font-body-lg text-primary">{email}</p>
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Phone Number</label>
              <p className="font-body-lg text-primary">{phone}</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <p className="font-body-md text-on-surface-variant italic opacity-70">
              To update your profile information, please contact our concierge team.
            </p>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="glass-panel p-stack-lg rounded-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/30 pb-4">Dining Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Dietary Requirements</label>
              <input 
                type="text" 
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Vegetarian, Gluten-Free"
                className="w-full bg-white/50 border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-sm px-4 py-3 font-body-md text-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Seating Preferences</label>
              <input 
                type="text" 
                value={seating}
                onChange={(e) => setSeating(e.target.value)}
                placeholder="e.g. Window seat, Quiet corner"
                className="w-full bg-white/50 border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-sm px-4 py-3 font-body-md text-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest uppercase">Wine Preferences</label>
              <input 
                type="text" 
                value={winePref}
                onChange={(e) => setWinePref(e.target.value)}
                placeholder="e.g. Bold reds, Dry whites"
                className="w-full bg-white/50 border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-sm px-4 py-3 font-body-md text-primary outline-none transition-all"
              />
            </div>
            
            <div className="pt-4">
              <button 
                onClick={handleSave}
                disabled={status === 'saving'}
                className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps tracking-widest hover:bg-surface-tint active:scale-95 transition-all duration-300 rounded-sm shadow-xl shadow-primary/10 disabled:opacity-50">
                {status === 'saving' ? 'SAVING...' : status === 'success' ? 'SAVED SUCCESSFULLY' : 'SAVE PREFERENCES'}
              </button>
              {status === 'error' && <p className="text-error font-body-md mt-2 text-center">Failed to save preferences. Try again.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
