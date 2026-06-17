import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "INVALID_INPUT", message: "Reservation ID is required." }, { status: 400 });
    }

    // Completely delete the reservation from the database
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Security: ensure the user owns this reservation

    if (error) {
      console.error("Cancellation Error:", error.message);
      return NextResponse.json({ error: "CANCELLATION_FAILED", message: "Failed to delete reservation." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Reservation cancelled." });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred." }, { status: 500 });
  }
}
