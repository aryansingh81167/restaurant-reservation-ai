import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/utils/supabase/server';
import { env } from '@/env';

const groq = new Groq({
  apiKey: env.groqApiKey,
});

export async function POST(req: Request) {
  try {
    const { message, session_id } = await req.json();
    
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "User not authenticated", status: 401 }, { status: 401 });
    }

    // Fetch context
    const { data: preferences } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: reservations } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(3);

    const systemPrompt = `
You are the Maître d' AI for LUMIÈRE, a premium Michelin-star level fine-dining reservation platform. 
You are speaking to a member of The Platinum Circle (or a valued guest).
Tone: Elegant, professional, exceptionally polite, and accommodating. Do not use emojis. Use refined vocabulary.

Member Context:
- Dietary: ${preferences?.dietary?.join(', ') || 'None'}
- Seating: ${preferences?.seating?.join(', ') || 'No preference'}
- Wine: ${preferences?.wine_pref?.join(', ') || 'No preference'}
- Past reservations: ${JSON.stringify(reservations)}

Your goal is to parse the user's intent and provide a helpful response.
You must return a valid JSON object with EXACTLY these keys:
- "reply": Your conversational response to the user.
- "intent": One of "book", "modify", "enquire", "recommend".
- "reservation_draft": If intent is "book", provide an object with "date" (YYYY-MM-DD), "time" (HH:MM), "guests" (number), and "notes" (string, include their seating/dietary preferences automatically). If not booking, this should be null.

Example output:
{
  "reply": "Of course. I have prepared a corner booth on the 3rd floor for you at 20:30 this Friday, taking into account your preference for a quiet setting.",
  "intent": "book",
  "reservation_draft": {
    "date": "2024-11-01",
    "time": "20:30",
    "guests": 2,
    "notes": "Corner booth, quiet setting"
  }
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    
    // Parse JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (e) {
      parsedResponse = {
        reply: "I apologize, but I am unable to process your request at this moment.",
        intent: "enquire",
        reservation_draft: null
      };
    }

    // Optionally save to concierge_sessions in supabase
    if (session_id) {
      // Append message logic here
    }

    return NextResponse.json(parsedResponse);

  } catch (error: unknown) {
    console.error("Chat API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Concierge is currently unavailable.", status: 500 },
      { status: 500 }
    );
  }
}
