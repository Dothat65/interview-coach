// app/home/page.js
// Import the server-side Supabase client helper
import { createClient } from '@/lib/utils/supabase/server'
// We might still need Link for the conditional part, let's keep it for now
import Link from 'next/link'
// --- Reintroducing UI Imports ---
import Card from '../components/Card' // Assuming Card component exists here
import styles from './home.module.css' // Assuming CSS module exists here
import { User, LogIn } from 'lucide-react' // Assuming lucide-react is installed

// Make the default export function async so we can use 'await' inside
export default async function HomePage() {
  // 1. Create the server-side Supabase client using our helper
  const supabase = createClient()

  // 2. Attempt to get the current user's session data
  let user = null; // Initialize user as null
  try {
      const { data } = await supabase.auth.getUser();
      user = data?.user; // Assign user if found
  } catch (error) {
      console.error("Error fetching user:", error);
      // Handle error appropriately, maybe render an error message
      // For now, we'll proceed with user as null
  }


  // 3. Log the user status (optional)
  if (user) {
    console.log('HomePage (Full UI): User session found.')
  } else {
    console.log('HomePage (Full UI): No user session found.')
  }

  // 4. Render UI content - Reintroducing all sections
  return (
    // Use a main div or fragment if needed
    <div>
      {/* --- Conditional Header Icon/Link --- */}
      <div className={styles.profileIcon}>
        {user ? (
          // If user exists, show Profile icon linking to /profile
          <Link href="/profile" title="Go to Profile">
            <User size={60} />
          </Link>
        ) : (
          // If no user, show Login icon linking to /login
          <Link href="/signup" title="Login / Signup">
            {/* Using LogIn icon, adjust size/style as needed */}
            <LogIn size={60} />
            {/* Or you could use text: */}
            {/* <span className={styles.loginLink}>Login / Signup</span> */}
          </Link>
        )}
      </div>

      {/* --- Reintroducing Title --- */}
      <div className={styles.home}>
        <h1 className={styles.title}>Interview Coach</h1>
      </div>

      {/* --- Reintroducing Hero Section --- */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay}></div>
      </div>

      {/* --- Reintroducing Card Container --- */}
      <div className={styles.cardContainer}>
        <Link href="/mockInterviewSelection" className={styles.cardLink}>
          <Card
            title="Mock Interviews"
            description="Practice your interview skills with real-world questions."
          />
        </Link>
        <Link href="/popularquestions" className={styles.cardLink}>
          <Card
            title="Popular Interview Questions"
            description="Explore a curated list of popular interview questions to prepare."
          />
        </Link>
        <Link href="/resources" className={styles.cardLink}>
          <Card
            title="Resources"
            description="Access a library of resources to prepare for interviews."
          />
        </Link>
      </div>

      {/* --- Reintroducing Footer Section --- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Interview Coach. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
