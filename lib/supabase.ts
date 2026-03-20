import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          brand: string;
          series: string;
          type: string;
          badge: string | null;
          rating: number;
          reviews: number;
          description: string;
          features: string[];
          specs: Record<string, string>;
          variants: Array<{ hp: string; price: number; orig: number; btu: string; sqm: string; tag: string }>;
          created_at: string;
        };
        Insert: {
          id: string;
          brand: string;
          series?: string;
          type: string;
          badge?: string | null;
          rating?: number;
          reviews?: number;
          description?: string;
          features?: string[];
          specs?: Record<string, string>;
          variants: Array<{ hp: string; price: number; orig: number; btu: string; sqm: string; tag: string }>;
        };
        Update: {
          brand?: string;
          series?: string;
          type?: string;
          badge?: string | null;
          rating?: number;
          reviews?: number;
          description?: string;
          features?: string[];
          specs?: Record<string, string>;
          variants?: Array<{ hp: string; price: number; orig: number; btu: string; sqm: string; tag: string }>;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_hp: string;
          quantity: number;
          tube_length: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          variant_hp: string;
          quantity: number;
          tube_length?: number | null;
        };
        Update: {
          quantity?: number;
          tube_length?: number | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          subtotal: number;
          promo_discount: number;
          delivery_fee: number;
          total: number;
          delivery_address: string;
          payment_method: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          status?: string;
          subtotal: number;
          promo_discount: number;
          delivery_fee: number;
          total: number;
          delivery_address: string;
          payment_method: string;
          notes?: string | null;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          brand: string;
          variant_hp: string;
          price: number;
          quantity: number;
          tube_length: number | null;
        };
        Insert: {
          order_id: string;
          product_id: string;
          product_name: string;
          brand: string;
          variant_hp: string;
          price: number;
          quantity: number;
          tube_length?: number | null;
        };
        Update: {
          quantity?: number;
        };
        Relationships: [];
      };
      career_interests: {
        Row: {
          id: string;
          name: string;
          email: string;
          contact: string;
          role: string;
          submitted_at: string;
        };
        Insert: {
          name: string;
          email: string;
          contact: string;
          role: string;
          submitted_at?: string;
        };
        Update: {
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Server-side client for API routes (uses service role key if available)
export const createServiceClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
