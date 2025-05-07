// components/SignOutButton.js
'use client' // Mark this as a Client Component

// --- Import the Supabase client INSTANCE ---
// Ensure this path points to the file that exports the browser client instance (likely named 'supabase')
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

// --- Rename function to PascalCase (standard for React components) ---
export default function SignOutButton() {
  // Get the router instance for navigation
  const router = useRouter()
  // --- Use the imported Supabase client instance directly ---
  // No need to call createBrowserClient() here, as it's already created in supabaseClient.js
  // const supabase = createBrowserClient() // REMOVE THIS LINE

  // Define the asynchronous function to handle the sign-out process
  const handleSignOut = async () => {
    console.log('Attempting to sign out...')
    // Call the Supabase signOut method using the imported instance
    const { error } = await supabase.auth.signOut()

    // Check if there was an error during sign out
    if (error) {
      console.error('Error signing out:', error)
      // Optionally display an error message to the user
      alert('Error signing out. Please try again.')
    } else {
      console.log('Sign out successful. Redirecting...')
      // Redirect the user to the home page after successful sign out
      // Using router.push('/') followed by router.refresh() ensures the layout re-renders
      // reflecting the logged-out state (e.g., showing the Login icon on HomePage).
      router.push('/') // Redirect to home page (or login page: '/login')
      router.refresh() // Refresh the current route to update server components
    }
  }

  // Render the button element
  // Attach the handleSignOut function to the onClick event
  return (
    <button
      // --- Apply styles similar to .editButton ---
      onClick={handleSignOut}
      style={{
        // Styles from .editButton
        padding: '14px 20px',
        borderRadius: '14px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease', // Added transition
        textAlign: 'center',
        display: 'flex', // Changed from inline-flex
        alignItems: 'center',
        justifyContent: 'center', // Added justify-content
        gap: '8px',
        border: '1px solid #e2e8f0', // Added border like editButton
        backgroundColor: '#f8fafc', // Background like editButton
        color: '#0f172a', // Text color like editButton
        // Add hover effect simulation using inline styles is complex,
        // better handled with CSS classes or styled-components if needed.
      }}
      // Add pseudo-class effects via event handlers if necessary (more complex)
      // onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      // onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Style icon similar to .buttonIcon */}
      <span style={{ fontSize: '1.1rem' }}>🚪</span>
      Sign Out
    </button>
  )
}
