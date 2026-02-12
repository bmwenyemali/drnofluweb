// Export only browser client from index
// Server client should be imported directly: import { createClient } from "@/lib/supabase/server"
export { createClient as createBrowserClient } from "./client";
