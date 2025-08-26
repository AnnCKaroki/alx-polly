import { createClient } from '@supabase/supabase-js'

// Ensure these environment variables are set in your .env.local file or deployment environment.
// They are crucial for connecting to your Supabase project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
