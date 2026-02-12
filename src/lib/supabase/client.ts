import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour les composants côté client
 * Utilisé dans les composants avec "use client"
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
