"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  profileName: string | null;
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  profileName: null,
  cartCount: 0,
  refreshCartCount: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  async function fetchProfileName(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    setProfileName((data as { full_name: string | null } | null)?.full_name ?? null);
  }

  async function fetchCartCount(userId: string) {
    const supabase = createClient();
    const { data } = await supabase.from("cart_items").select("quantity").eq("user_id", userId);
    setCartCount(data?.reduce((s, r) => s + r.quantity, 0) ?? 0);
  }

  const refreshCartCount = async () => {
    if (user) await fetchCartCount(user.id);
  };

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        fetchProfileName(data.user.id);
        fetchCartCount(data.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileName(session.user.id);
        fetchCartCount(session.user.id);
      } else {
        setProfileName(null);
        setCartCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileName(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, profileName, cartCount, refreshCartCount, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
