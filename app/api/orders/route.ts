import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { items, subtotal, promo_discount, delivery_fee, total, delivery_address, payment_method, notes } = body;

    if (!items?.length || !delivery_address || !payment_method) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Create order
    const { data: orderData, error: orderError } = await (supabase
      .from("orders") as any)
      .insert({
        user_id: user.id,
        status: "pending",
        subtotal,
        promo_discount: promo_discount ?? 0,
        delivery_fee,
        total,
        delivery_address,
        payment_method,
        notes: notes ?? null,
      })
      .select()
      .single();

    const order = orderData as OrderRow | null;

    if (orderError || !order) {
      throw orderError ?? new Error("Failed to create order");
    }

    // Insert order items
    const orderItems: Database["public"]["Tables"]["order_items"]["Insert"][] = items.map((item: {
      product_id: string;
      product_name: string;
      brand: string;
      variant_hp: string;
      price: number;
      quantity: number;
    }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      brand: item.brand,
      variant_hp: item.variant_hp,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await (supabase.from("order_items") as any).insert(orderItems);
    if (itemsError) throw itemsError;

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    return NextResponse.json({ success: true, order_id: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: ordersData, error } = await (supabase
      .from("orders") as any)
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const orders = ordersData as (OrderRow & { order_items: OrderItemRow[] })[];

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
