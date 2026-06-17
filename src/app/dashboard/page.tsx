import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch preferences
  const { data: preferences } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch reservations
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant font-label-caps tracking-widest animate-pulse">Loading Dossier...</div>}>
      <DashboardClient 
        user={user} 
        preferences={preferences || {}} 
        reservations={reservations || []} 
      />
    </Suspense>
  );
}
