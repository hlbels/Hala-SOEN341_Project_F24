import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kigcqwmosrzgzintryua.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZ2Nxd21vc3J6Z3ppbnRyeXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTE5MTksImV4cCI6MjA0NjEyNzkxOX0.civrJ-7yrxU9tP3KHyFL-q6voIOUCnp1Cwz03nSjfTY";
export const supabase = createClient(supabaseUrl, supabaseKey);
