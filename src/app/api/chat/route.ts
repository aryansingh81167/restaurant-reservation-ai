import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/utils/supabase/server';
import { env } from '@/env';

const groq = new Groq({
  apiKey: env.groqApiKey,
});

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `
You are the Maître d' AI for LUMIÈRE, a premium Michelin-star level fine-dining reservation platform.
You are speaking to a member of The Platinum Circle (or a valued guest).

TONE & STYLE:
- Elegant, professional, exceptionally polite, and accommodating
- Do not use emojis
- Use refined, sophisticated vocabulary befitting a world-class establishment
- Keep responses concise but warm — no longer than 3 sentences unless detailed information is requested
- Address the guest with respect and anticipation of their needs

CAPABILITIES:
- Book new reservations (ask for date, time, and party size if not provided)
- Recommend dining experiences, wine pairings, and seasonal menus
- Answer questions about LUMIÈRE (cuisine: modern French, dress code: smart casual, location: downtown)
- Modify or discuss existing reservations

RESTAURANT DETAILS:
- Cuisine: Modern French with seasonal tasting menus
- Signature dishes: Truffle Risotto, Pan-Seared Dover Sole, Wagyu Beef Tartare
- Hours: Tuesday–Sunday, 18:00–23:00 (closed Mondays)
- Dress code: Smart casual (jackets appreciated but not required)
- Seating options: Main dining room, private dining, terrace, chef's table
- Wine program: 800+ labels, sommelier available

RESPONSE FORMAT:
You must return a valid JSON object with EXACTLY these keys:
- "reply": Your conversational response to the guest.
- "intent": One of "book", "modify", "enquire", "recommend".
- "reservation_draft": If intent is "book" AND you have enough information (date, time, guests), provide an object with "date" (YYYY-MM-DD), "time" (HH:MM), "guests" (number), and "notes" (string). Otherwise null.
- "confirmed": Set to true ONLY if the guest explicitly confirms a booking. Otherwise false.

IMPORTANT BOOKING RULES:
- When a guest wants to book, first propose the reservation details and ask for confirmation.
- Only set "confirmed": true when the guest says yes/confirm/perfect/book it/go ahead or similar affirmative.
- If the guest has not yet confirmed, set "confirmed": false and "reservation_draft" with the proposed details.
- Always incorporate known preferences (dietary, seating, wine) into the notes automatically.
- Use the current year (2026) for dates unless specified otherwise.
`;

async function callGroq(messages: { role: string; content: string }[]) {
  try {
    const completion = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });
    return completion.choices[0]?.message?.content || '{}';
  } catch (primaryError: any) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed: ${primaryError.message}. Falling back to ${FALLBACK_MODEL}.`);
    try {
      const completion = await groq.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: messages as any,
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });
      return completion.choices[0]?.message?.content || '{}';
    } catch (fallbackError: any) {
      console.error(`Fallback model (${FALLBACK_MODEL}) also failed: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", reply: "Please sign in to access the concierge." },
        { status: 401 }
      );
    }

    // Fetch context
    const { data: preferences } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    // Build the system prompt with member context
    const contextualPrompt = SYSTEM_PROMPT + `
MEMBER CONTEXT:
- Name: ${user.user_metadata?.first_name || 'Guest'}
- Dietary preferences: ${preferences?.dietary?.join(', ') || 'None specified'}
- Seating preferences: ${preferences?.seating?.join(', ') || 'No preference'}
- Wine preferences: ${preferences?.wine_pref?.join(', ') || 'No preference'}
- Existing reservations: ${existingReservations?.length ? JSON.stringify(existingReservations.map(r => ({ date: r.date, time: r.time, guests: r.party_size || r.guests, status: r.status }))) : 'None'}
- Today's date: ${new Date().toISOString().split('T')[0]}
`;

    // Build conversation messages with history
    const conversationMessages: { role: string; content: string }[] = [
      { role: "system", content: contextualPrompt },
    ];

    // Include conversation history (last 10 messages max)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        conversationMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.role === 'assistant' ? JSON.stringify({ reply: msg.content, intent: 'enquire', reservation_draft: null, confirmed: false }) : msg.content,
        });
      }
    }

    conversationMessages.push({ role: "user", content: message });

    // Call Groq with fallback
    const responseContent = await callGroq(conversationMessages);
    
    // Parse JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch {
      parsedResponse = {
        reply: "I apologize, but I encountered a brief interruption. Could you kindly repeat your request?",
        intent: "enquire",
        reservation_draft: null,
        confirmed: false,
      };
    }

    // If confirmed booking, save to Supabase
    if (parsedResponse.confirmed && parsedResponse.reservation_draft) {
      const draft = parsedResponse.reservation_draft;
      const { data: newReservation, error: insertError } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          date: draft.date,
          time: draft.time,
          guests: draft.guests || 2,
          notes: draft.notes || '',
          status: 'confirmed',
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to save reservation:", insertError.message);
        parsedResponse.reply += "\n\nHowever, I was unable to save your reservation to the system. Please try the standard booking form, or contact us directly.";
        parsedResponse.booking_saved = false;
      } else {
        parsedResponse.booking_saved = true;
        parsedResponse.reservation_id = newReservation?.id;
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error: unknown) {
    console.error("Chat API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        reply: "I sincerely apologize, but the concierge line is momentarily unavailable. Please try again in a moment.",
        intent: "enquire",
        reservation_draft: null,
        confirmed: false,
        error: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
