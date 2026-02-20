/**
 * Supabase Admin Client
 * Uses service role key for server-side operations (uploads, database, etc.)
 * Only use this in API routes, never expose to the browser
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let adminClientInstance: SupabaseClient | null = null;

/**
 * Get or create the admin client
 * This is deferred until runtime to avoid build-time initialization errors
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClientInstance) {
    if (!supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to your .env.local file. " +
          'Get it from Supabase Dashboard → Project Settings → API → "Service Role Secret Key"',
      );
    }

    adminClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClientInstance;
}
