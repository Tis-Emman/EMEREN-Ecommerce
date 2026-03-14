import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, contact, role, submittedAt } = body;

    if (!name || !email || !contact || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { error } = await supabase
      .from("career_interests")
      .insert([{ name, email, contact, role, submitted_at: submittedAt }]);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Career form error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}