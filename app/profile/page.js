// app/profile/page.js

// Import the server-side Supabase client helper and redirect function
import { createClient } from '@/lib/utils/supabase/server' // Adjust path if needed
import { redirect } from 'next/navigation'

// Import styles and Link component
import styles from './profile.module.css' // Assuming CSS module exists here
import Link from 'next/link' // Keep Link for potential future use

import SignOutButton from '@/app/components/signout' // Adjust path if needed
// No useState or useEffect imports needed for Server Components

// Make the default export function async
export default async function ProfilePage() {
  // 1. Create the server-side Supabase client
  const supabase = createClient()

  // 2. Get authenticated user data
  const { data: authData, error: authError } = await supabase.auth.getUser()

  // 3. Redirect if user is not logged in
  if (authError || !authData?.user) {
    console.log('ProfilePage: No user session, redirecting to login.')
    redirect('/login') // Adjust path if needed
  }

  // 4. User is logged in, get their ID
  const user = authData.user // Assign the authenticated user object
  console.log('ProfilePage: User session found:', user)

  // 5. Fetch the user's profile data from the 'user_profiles' table
  let profileData = null
  let profileError = null
  try {
    const { data, error } = await supabase
      .from('user_profiles') // Your profile table name
      .select('*') // Select all columns (or specify needed ones like 'full_name', 'avatar_url')
      .eq('user_id', user.id) // Filter by the logged-in user's ID
      .maybeSingle() // Expect 0 or 1 row

    profileData = data
    profileError = error
  } catch (err) {
    console.error('ProfilePage: Error fetching profile:', err)
    profileError = err
  }

  if (profileError) {
    console.error('ProfilePage: Database error fetching profile:', profileError.message)
    // Optionally display an error message in the UI
  }

  // Helper function to calculate days - can stay as it uses fetched data
  const daysSinceMember = () => {
    // Use the real user's created_at timestamp
    const createdDate = new Date(user.created_at)
    const today = new Date()
    const diffTime = Math.abs(today - createdDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Note: Loading state isn't typically needed in Server Components
  // as the page only renders after data fetching is complete (or fails).

  // 6. Render the profile page using the fetched data
  return (
    <div className={styles.container}>
      <div className={styles.profileGrid}>
        {/* Profile Summary Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {/* Use real profileData or fallback */}
                {profileData?.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Profile" />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className={styles.badgeContainer}>
                {/* Badge logic might need real data if applicable */}
                <span className={styles.badge}>Premium</span>
              </div>
            </div>
            {/* Use real profileData or fallback */}
            <h1 className={styles.profileName}>{profileData?.full_name || 'User'}</h1>
            {/* Use real user email */}
            <p className={styles.profileEmail}>{user.email}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Member Since</span>
              {/* Use real user created_at */}
              <span className={styles.value}>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>

            {/* Use real user provider if available */}
            {user.app_metadata?.provider && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Sign-in Method</span>
                <span className={styles.value}>{user.app_metadata.provider}</span>
              </div>
            )}

            <div className={styles.detailItem}>
              <span className={styles.label}>Account Type</span>
              <span className={styles.value}>
                <span className={styles.premiumTag}>Premium</span> {/* Placeholder */}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Interviews Completed</span>
              <span className={styles.value}>12</span> {/* Placeholder */}
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileActions}>
            {/* Edit button might link somewhere or become a Client Component */}
            <button className={styles.editButton}>
              <span className={styles.buttonIcon}>✏️</span>
              Edit Profile
            </button>
            {/* Logout button NEEDS to be a Client Component to function */}
            <SignOutButton />
          </div>
        </div>

        {/* Activity & Stats - Replace mock data with real data if available */}
        <div className={styles.activitySection}>
          {/* Interview Progress Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Interview Progress</h2>
            <p className={styles.cardDescription}>Track your interview preparation journey</p>
            {/* Placeholder progress */}
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span>Interviews Completed</span>
                <span className={styles.progressCount}>12 / 20</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '60%' }}></div>
              </div>
              <p className={styles.progressNote}>
                You&#39;re making great progress! Complete 8 more interviews to reach your goal.
              </p>
            </div>
            {/* Stats using real data where possible */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>12</div> {/* Placeholder */}
                <div className={styles.statLabel}>Interviews Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>24</div> {/* Placeholder */}
                <div className={styles.statLabel}>Questions Answered</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{daysSinceMember()}</div>
                <div className={styles.statLabel}>Days as Member</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>4</div> {/* Placeholder */}
                <div className={styles.statLabel}>Skills Mastered</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card - Requires fetching activity data */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <p className={styles.cardDescription}>Your latest interview preparation activities</p>
            {/* Placeholder activity list */}
            <div className={styles.activityList}>
              <p><i>(Recent activity data fetching not implemented yet.)</i></p>
              {/* ... placeholder items ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
