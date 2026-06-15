import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { date, time, guests, notes } = await req.json();

    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in to make a reservation." },
        { status: 401 }
      );
    }

    // Validate inputs
    if (!date || !time) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Date and time are required." },
        { status: 400 }
      );
    }

    // Insert reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        date,
        time,
        guests: guests || 2,
        notes: notes || '',
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      console.error("Booking Error:", error.message);
      return NextResponse.json(
        { error: "BOOKING_FAILED", message: "Unable to complete your reservation. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation,
      message: "Your table has been reserved.",
    });

  } catch (error: unknown) {
    console.error("Book API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
