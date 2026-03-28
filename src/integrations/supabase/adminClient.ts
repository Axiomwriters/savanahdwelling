
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./client";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const isValidKey = supabaseServiceKey && 
  supabaseServiceKey.length > 20 && 
  !supabaseServiceKey.includes("your_") &&
  supabaseServiceKey.startsWith("eyJ");

export const supabaseAdmin = supabaseUrl && supabaseServiceKey && isValidKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;
