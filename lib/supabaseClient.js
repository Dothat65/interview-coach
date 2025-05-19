// lib/supabaseClient.js
// Import the specific function for creating a Supabase client in the browser
import { createBrowserClient } from '@supabase/ssr'

// Define the function to create the client
// Note: It's often better to export a function that creates the client
// rather than exporting the client directly, especially in Next.js
// But exporting the client directly can also work.
// We'll export the client directly here for simplicity based on your AuthPage import.

// Create the Supabase client instance for browser usage
export const supabase = createBrowserClient(
  // Pass the Supabase URL and Anon Key from environment variables
  // Ensure these variables are prefixed with NEXT_PUBLIC_ to be available in the browser
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// If you prefer exporting a function (slightly safer pattern):
/*
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
// Then in AuthPage.js you would do:
// import { createSupabaseBrowserClient } from '../../lib/supabaseClient'
// const supabase = createSupabaseBrowserClient()
*/

