import { NextRequest, NextResponse } from "next/server";
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

function isAdmin(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
}

// GET /api/admin/orders — list all orders with items + profile email
export async function GET(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const service = createServiceClient();

    let query = (service.from("orders") as any)
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ orders: data ?? [] });
  } catch (err) {
    console.error("Admin orders GET error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status." }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "delivered", "installed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const service = createServiceClient();
    const { error } = await (service.from("orders") as any)
      .update({ status })
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin orders PATCH error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
