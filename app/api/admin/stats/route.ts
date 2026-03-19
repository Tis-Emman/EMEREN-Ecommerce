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

export async function GET() {
  try {
    const user = await getRequestUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const isAdmin =
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin";
    if (!isAdmin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const service = createServiceClient();

    // Parallel queries
    const [ordersRes, usersRes, careersRes] = await Promise.all([
      (service.from("orders") as any).select("id, total, status, created_at"),
      (service.from("profiles") as any).select("id, created_at"),
      (service.from("career_interests") as any).select("id, submitted_at"),
    ]);

    const orders = (ordersRes.data ?? []) as { id: string; total: number; status: string; created_at: string }[];
    const users  = (usersRes.data  ?? []) as { id: string; created_at: string }[];
    const careers = (careersRes.data ?? []) as { id: string }[];

    const totalRevenue   = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const pendingCount   = orders.filter(o => o.status === "pending").length;
    const deliveredCount = orders.filter(o => o.status === "delivered").length;

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en-PH", { month: "short", year: "2-digit" });
      const revenue = orders
        .filter(o => {
          const od = new Date(o.created_at);
          return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && o.status !== "cancelled";
        })
        .reduce((s, o) => s + o.total, 0);
      monthlyRevenue.push({ month: key, revenue });
    }

    // Orders by status
    const statusCounts = ["pending", "confirmed", "delivered", "installed", "cancelled"].map(s => ({
      status: s,
      count: orders.filter(o => o.status === s).length,
    }));

    return NextResponse.json({
      totalOrders:   orders.length,
      totalRevenue,
      pendingCount,
      deliveredCount,
      totalUsers:    users.length,
      totalCareers:  careers.length,
      monthlyRevenue,
      statusCounts,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
