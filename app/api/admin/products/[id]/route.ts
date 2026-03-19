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

// PATCH — update a product (admin only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser();
    const isAdmin = user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
    if (!user || !isAdmin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const service = createServiceClient();
    const { data, error } = await (service.from("products") as any)
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ product: data });
  } catch (err) {
    console.error("Admin products PATCH error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE — delete a product (admin only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser();
    const isAdmin = user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
    if (!user || !isAdmin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await params;
    const service = createServiceClient();
    const { error } = await (service.from("products") as any).delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin products DELETE error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
