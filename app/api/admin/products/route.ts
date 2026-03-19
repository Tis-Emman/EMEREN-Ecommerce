import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServiceClient, type Database } from "@/lib/supabase";

async function getRequestUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// POST — create a new product (admin only)
export async function POST(req: Request) {
  try {
    const user = await getRequestUser();
    const isAdmin = user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
    if (!user || !isAdmin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const body = await req.json();
    const service = createServiceClient();
    const { data, error } = await (service.from("products") as any)
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    console.error("Admin products POST error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
