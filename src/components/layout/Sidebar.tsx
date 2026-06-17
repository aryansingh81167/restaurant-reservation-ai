"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: "calendar_month", label: "Reservations" },
    { href: "/dashboard/settings", icon: "manage_accounts", label: "Account Settings" },
    { href: "/dashboard", icon: "credit_card", label: "Payment Methods" },
    { href: "/dashboard", icon: "notifications", label: "Notifications" },
    { href: "/dashboard", icon: "support_agent", label: "Support" },
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out flex-shrink-0 ${isCollapsed ? "w-[80px]" : "w-full md:w-64"}`}>
      <div className="sticky top-[120px] glass-panel p-4 rounded-sm shadow-sm border border-outline-variant/30 flex flex-col h-[calc(100vh-140px)]">
        
        <div className={`flex items-center mb-6 pb-6 border-b border-outline-variant/20 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="font-headline-sm text-headline-sm text-primary mb-1 whitespace-nowrap">My Dossier</h2>
              <p className="font-body-xs text-on-surface-variant truncate opacity-80 max-w-[150px]">{userEmail}</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-surface-container rounded-full transition-colors text-primary flex-shrink-0 flex items-center justify-center"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCollapsed ? "menu" : "menu_open"}
            </span>
          </button>
        </div>

        <nav className="flex flex-col space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {links.map((link, idx) => {
            // Need exact match for /dashboard so it doesn't highlight when on /dashboard/settings
            const isActive = link.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={idx}
                href={link.href} 
                className={`p-3 text-[12px] font-label-caps text-label-caps uppercase tracking-widest rounded-sm transition-all flex items-center whitespace-nowrap overflow-hidden
                  ${isCollapsed ? 'justify-center' : 'gap-4'}
                  ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'}`}
                title={isCollapsed ? link.label : ""}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
