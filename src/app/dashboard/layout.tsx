import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="pt-[120px] min-h-screen px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row gap-gutter pb-section-gap">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-[120px] glass-panel p-6 rounded-sm shadow-sm border border-outline-variant/30">
          <div className="mb-6 pb-6 border-b border-outline-variant/20">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-1">My Dossier</h2>
            <p className="font-body-md text-on-surface-variant truncate opacity-80">{user.email}</p>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard" className="px-4 py-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container rounded-sm transition-colors text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Reservations
            </Link>
            <Link href="/dashboard/settings" className="px-4 py-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant hover:text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              Account Settings
            </Link>
            <Link href="/dashboard" className="px-4 py-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant hover:text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              Payment Methods
            </Link>
            <Link href="/dashboard" className="px-4 py-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant hover:text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Notifications
            </Link>
            <Link href="/dashboard" className="px-4 py-3 text-[13px] font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container rounded-sm transition-colors text-on-surface-variant hover:text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              Support
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
