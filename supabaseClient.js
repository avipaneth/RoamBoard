let supabaseClient = null;

export async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const config = window.ROAMBOARD_SUPABASE_CONFIG || {};
  const supabaseUrl = config.supabaseUrl;
  const supabaseAnonKey = config.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  // The anon key is safe to expose only because Supabase RLS allows anonymous users
  // to insert preorders, while denying public reads, updates and deletes.
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}
