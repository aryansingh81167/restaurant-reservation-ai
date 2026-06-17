import { createClient } from "@/utils/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="pt-[120px] min-h-screen px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row gap-gutter pb-section-gap">
      <Sidebar userEmail={user.email || ""} />
      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
