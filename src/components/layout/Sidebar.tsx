"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Handle responsive auto-collapse and offset CSS variable
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        setIsCollapsed(true);
      }
      document.documentElement.style.setProperty(
        '--sidebar-offset', 
        (!isCollapsed && isDesktop) ? '260px' : '0px'
      );
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.documentElement.style.setProperty('--sidebar-offset', '0px');
    };
  }, [isCollapsed]);

  const links = [
    { href: "/dashboard", icon: "calendar_month", label: "Reservations" },
    { href: "/dashboard?ai=true", icon: "temp_preferences_custom", label: "AI Concierge" },
    { href: "/dashboard/settings", icon: "manage_accounts", label: "Account Settings" },
    { href: "/dashboard", icon: "notifications", label: "Notifications" },
    { href: "/dashboard", icon: "mail", label: "Contact" },
  ];

  return (
    <>
      {/* Mobile Overlay Background */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* The Sidebar itself - Full height, fixed to left edge */}
      <aside 
        className={`fixed top-0 left-0 h-screen z-50 bg-background border-r border-outline-variant/30 flex flex-col transition-transform duration-300 ease-in-out w-[260px] ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} shadow-2xl lg:shadow-none`}
      >
        <div className="p-4 flex flex-col h-full w-[260px]">
          {/* Top Controls */}
          <div className="flex items-center justify-end mb-8 pt-4 px-2">
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant hover:text-primary flex-shrink-0 flex items-center justify-center"
              title="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">menu_open</span>
            </button>
          </div>

          <div className="mb-6 pb-6 border-b border-outline-variant/20 px-2">
            <h2 className="font-headline-sm text-[15px] font-bold text-primary mb-1">Concierge</h2>
            <p className="font-body-xs text-[12px] text-on-surface-variant truncate opacity-80">{userEmail}</p>
          </div>

          <nav className="flex flex-col space-y-1 flex-1 overflow-y-auto custom-scrollbar px-1">
            {links.map((link, idx) => {
              const isActive = link.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname.startsWith(link.href);
                
              return (
                <Link 
                  key={idx}
                  href={link.href} 
                  className={`p-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest rounded-sm transition-all flex items-center gap-4
                    ${isActive ? 'bg-surface-container-high text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom User Area */}
          <div className="pt-4 mt-auto border-t border-outline-variant/20 px-1 pb-2">
             <div className="flex items-center gap-3 p-3 rounded-sm hover:bg-surface-container cursor-pointer transition-colors text-on-surface hover:text-primary">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                  {userEmail?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-label-caps text-[11px] truncate tracking-widest uppercase">{userEmail.split('@')[0]}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Floating button when collapsed */}
      <button 
        onClick={() => setIsCollapsed(false)}
        className={`fixed z-50 transition-all duration-300 flex items-center justify-center 
          lg:left-4 lg:top-[18px] lg:p-2 lg:bg-transparent lg:text-primary lg:hover:bg-surface-container lg:rounded-sm
          max-lg:bottom-6 max-lg:right-6 max-lg:p-4 max-lg:bg-primary max-lg:text-on-primary max-lg:rounded-full max-lg:shadow-2xl max-lg:hover:scale-105
          ${isCollapsed ? 'opacity-100 lg:translate-x-0 max-lg:translate-y-0' : 'opacity-0 lg:-translate-x-10 max-lg:translate-y-20 pointer-events-none'}`}
        title="Open sidebar"
      >
        <span className="material-symbols-outlined text-[28px]">menu</span>
      </button>

      {/* Spacer for desktop to push main content rightward smoothly */}
      <div className={`hidden lg:block transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'w-0' : 'w-[260px]'}`} />
    </>
  );
}
