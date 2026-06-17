import { createClient } from "@/utils/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen w-full flex bg-background">
      <Sidebar userEmail={user.email || ""} />
      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300 pt-[72px] px-4 sm:px-8 md:px-12 lg:px-16 pb-12 w-full max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
