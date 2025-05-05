// utils/supabase/server.js
// Import functions needed to create a Supabase client for server-side rendering
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers' // Next.js function to access cookies on the server

// Define a function that creates a Supabase client specifically for Server Components
export const createClient = () => {
  // Get the cookie store for the current incoming request.
  // This is crucial for the server client to read the user's session cookie.
  const cookieStore = cookies()

  // Create and return the Supabase server client.
  // It needs the Supabase URL, anon key, and cookie handling functions.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // Provide methods for the Supabase client to interact with cookies
      cookies: {
        // Function to get a specific cookie's value
        get(name) {
          return cookieStore.get(name)?.value
        },
        // Function to set a cookie (often handled by middleware, but required by the library)
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignore errors if middleware is handling cookie setting
            console.log('Server Client: Error setting cookie (middleware might handle this)', error)
          }
        },
        // Function to remove a cookie (often handled by middleware, but required by the library)
        remove(name, options) {
          try {
            // Attempt to remove cookie by setting an empty value and options
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
             // Ignore errors if middleware is handling cookie removal
             console.log('Server Client: Error removing cookie (middleware might handle this)', error)
          }
        },
      },
    }
  )
}
