// middleware.js
// Import necessary functions from Supabase SSR helper and Next.js server
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// The main middleware function that runs for specified requests
export async function middleware(request) {
  // Create a response object that allows modifying headers/cookies later
  // It starts by cloning the original request headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client specifically designed for Server Components/Middleware/Route Handlers
  // It needs access to cookies to manage the user's session
  const supabase = createServerClient(
    // Pass your Supabase project URL and anon key from environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // Define cookie handling functions for the Supabase client
      cookies: {
        // Function to retrieve a cookie by name
        get(name) {
          return request.cookies.get(name)?.value
        },
        // Function to set a cookie
        // IMPORTANT: It must update both the request cookies (for immediate use)
        // AND the response cookies (to send back to the browser)
        set(name, value, options) {
          // Update the request cookies (useful if you read cookies again later in the same request)
          request.cookies.set({ name, value, ...options })
          // Create a new response object to ensure we can modify headers/cookies
          // (Response objects can become immutable after certain operations)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // Set the cookie on the response to be sent back to the browser
          response.cookies.set({ name, value, ...options })
        },
        // Function to remove a cookie
        // IMPORTANT: Similar to set, it must update both request and response cookies
        remove(name, options) {
          // Update the request cookies by setting the value to empty
          request.cookies.set({ name, value: '', ...options })
          // Create a new response object
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // Delete the cookie on the response
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  // **CRITICAL STEP:** Refresh the user's session
  // This checks the validity of the session cookie, refreshes the token if needed,
  // and makes the user session available server-side via supabase.auth.getUser() later.
  // It utilizes the cookie handling functions defined above.
  await supabase.auth.getUser()

  // Return the response object (potentially with updated cookies)
  // This allows the request to proceed to the actual page or API route
  return response
}

// Configuration for the middleware
export const config = {
  // Define the paths where this middleware should run
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files like CSS, JS chunks)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This prevents the middleware from running unnecessarily on static assets.
     * You might need to adjust this pattern based on your specific needs (e.g., exclude API routes if they handle auth differently).
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
