"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function TopNavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check auth state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowMenu(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-300">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-md w-full max-w-container-max mx-auto">
        <div className="flex items-center transition-all duration-300 ease-in-out" style={{ transform: 'translateX(var(--sidebar-offset, 0px))' }}>
          <Link href="/" className="font-display-lg text-display-lg text-primary tracking-tight hover:opacity-80 transition-opacity">LUMIÈRE</Link>
        </div>
        <div className="flex items-center space-x-6 md:space-x-10">
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/menu" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
              My Dossier
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>


          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="hidden md:flex items-center gap-2 text-on-surface font-medium hover:text-secondary transition-colors font-label-caps text-label-caps uppercase tracking-widest">
                <span className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-[11px] font-semibold">
                  {(user.user_metadata?.first_name || user.email)?.[0]?.toUpperCase() || 'G'}
                </span>
                {user.user_metadata?.first_name || 'Account'}
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-12 bg-surface-container-low border border-outline-variant/30 shadow-2xl rounded-sm py-2 min-w-[180px] z-50 animate-fade-in">
                    <Link href="/dashboard" onClick={() => setShowMenu(false)} className="block px-4 py-3 font-label-caps text-[11px] text-on-surface hover:bg-surface-container-high transition-colors tracking-widest uppercase">My Dashboard</Link>
                    <Link href="/dashboard/concierge" onClick={() => setShowMenu(false)} className="block px-4 py-3 font-label-caps text-[11px] text-on-surface hover:bg-surface-container-high transition-colors tracking-widest uppercase">AI Concierge</Link>
                    <Link href="/dashboard/settings" onClick={() => setShowMenu(false)} className="block px-4 py-3 font-label-caps text-[11px] text-on-surface hover:bg-surface-container-high transition-colors tracking-widest uppercase">Account Settings</Link>
                    <div className="border-t border-outline-variant/30 my-1"></div>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-3 font-label-caps text-[11px] text-error hover:bg-error-container transition-colors tracking-widest uppercase">Sign Out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-on-surface font-medium hover:text-secondary transition-colors font-label-caps text-label-caps uppercase tracking-widest">Sign In</Link>
          )}

          <Link href="/dashboard" className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps hover:bg-surface-tint active:scale-95 transition-all duration-300 text-center uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 rounded-sm">Book Now</Link>
          
          <button 
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="md:hidden flex items-center hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-primary">{showMobileNav ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {showMobileNav && (
        <div className="md:hidden bg-surface-container-low border-t border-outline-variant/30 animate-fade-in">
          <nav className="flex flex-col px-margin-mobile md:px-margin-desktop py-4 space-y-4">
            <Link href="/about" onClick={() => setShowMobileNav(false)} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2">About Us</Link>
            <Link href="/menu" onClick={() => setShowMobileNav(false)} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2">Menu</Link>
            <Link href="/dashboard" onClick={() => setShowMobileNav(false)} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2">My Dossier</Link>
            <Link href="/dashboard/settings" onClick={() => setShowMobileNav(false)} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2">Account Settings</Link>
            {user ? (
              <button onClick={handleSignOut} className="font-label-caps text-label-caps uppercase tracking-widest text-error hover:text-on-error-container transition-colors py-2 text-left">Sign Out</button>
            ) : (
              <Link href="/login" onClick={() => setShowMobileNav(false)} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2">Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
