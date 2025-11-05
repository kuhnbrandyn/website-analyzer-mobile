import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables are stored safely in Expo Secrets
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Create a single instance of Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example reusable call (optional)
export async function checkTrustScore(url) {
  try {
    // Replace with your real backend call later
    const { data, error } = await supabase.functions.invoke("analyze-site", {
      body: { url },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Trustify Supabase Error:", err.message);
    throw err;
  }
}
