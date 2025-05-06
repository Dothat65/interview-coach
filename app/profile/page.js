// app/profile/page.js

// Import the server-side Supabase client helper and redirect function
import { createClient } from '@/lib/utils/supabase/server' // Adjust path if needed
import { redirect } from 'next/navigation'

// Import styles and Link component
import styles from './profile.module.css' // Assuming CSS module exists here
import Link from 'next/link'

// Import the SignOutButton Client Component
import SignOutButton from '@/app/components/signout' // Adjust path if needed


export default async function ProfilePage() {
  // 1. Create the server-side Supabase client
  const supabase = createClient()

  // 2. Get authenticated user data
  const { data: authData, error: authError } = await supabase.auth.getUser()

  // 3. Redirect if user is not logged in
  if (authError || !authData?.user) {
    console.log('ProfilePage: No user session, redirecting to login.')
    redirect('/login')
  }
  const user = authData.user
  console.log('ProfilePage: User session found:', user)

  // 4. Fetch the user's profile data from 'user_profiles'
  let profileData = null
  let profileError = null
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) throw error
    profileData = data
  } catch (err) {
    console.error('ProfilePage: Error fetching profile:', err)
    profileError = err.message
  }

  // 5. Fetch interview rounds data to calculate stats
  let questionsAnswered = 0;
  let interviewsCompleted = 0;
  let skillsMastered = 0; // Based on unique topics
  let statsError = null;

  try {
    // Get all rounds to calculate unique sessions and topics
    const { data: roundsData, error: roundsError } = await supabase
      .from('interview_rounds')
      .select('session_id, topic')
      .eq('user_id', user.id);

    if (roundsError) throw roundsError;

    if (roundsData) {
      questionsAnswered = roundsData.length; // Each row is an answered question

      const uniqueSessionIds = new Set();
      const uniqueTopics = new Set();

      roundsData.forEach(round => {
        uniqueSessionIds.add(round.session_id);
        if (round.topic) { // Ensure topic is not null or empty
            uniqueTopics.add(round.topic);
        }
      });

      interviewsCompleted = uniqueSessionIds.size;
      skillsMastered = uniqueTopics.size;
    }
    console.log('ProfilePage: Stats calculated - Questions:', questionsAnswered, 'Sessions:', interviewsCompleted, 'Topics:', skillsMastered);

  } catch (err) {
    console.error('ProfilePage: Error fetching/calculating interview stats:', err);
    statsError = err.message;
  }

  // 6. Fetch recent activity (e.g., last 3 interview rounds)
  let recentActivities = [];
  let activityError = null;
  try {
    const { data, error } = await supabase
      .from('interview_rounds')
      .select('id, created_at, topic, question') // Select fields for recent activity display
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }) // Newest first
      .limit(3); // Get the last 3 activities

    if (error) throw error;
    recentActivities = data || [];
    console.log(`ProfilePage: Fetched ${recentActivities.length} recent activities.`);
  } catch (err) {
    console.error('ProfilePage: Error fetching recent activities:', err);
    activityError = err.message;
  }


  // Helper function to calculate days since member joined
  const daysSinceMember = () => {
    const createdDate = new Date(user.created_at)
    const today = new Date()
    const diffTime = Math.abs(today - createdDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // 7. Render the profile page
  return (
    <div className={styles.container}>
      <div className={styles.profileGrid}>
        {/* Profile Summary Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {profileData?.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Profile" />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className={styles.badgeContainer}>
                <span className={styles.badge}>Standard</span> {/* Placeholder or fetch from profileData */}
              </div>
            </div>
            <h1 className={styles.profileName}>{profileData?.full_name || user.email}</h1>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            {user.app_metadata?.provider && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Sign-in Method</span>
                <span className={styles.value}>{user.app_metadata.provider}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.label}>Account Type</span>
              <span className={styles.value}>
                <span className={styles.premiumTag}>Standard</span> {/* Placeholder */}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Interviews Completed</span>
              <span className={styles.value}>{interviewsCompleted}</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileActions}>
      
            <Link href="/profile/history" className={styles.editButton} style={{textDecoration: 'none'}}> {/* Style as button */}
                <span className={styles.buttonIcon}>📜</span>
                View History
            </Link>
            <SignOutButton />
          </div>
        </div>

        {/* Activity & Stats */}
        <div className={styles.activitySection}>
          {profileError && <p style={{color: 'red'}}>Error loading profile: {profileError}</p>}
          {statsError && <p style={{color: 'red'}}>Error loading stats: {statsError}</p>}
          {activityError && <p style={{color: 'red'}}>Error loading recent activity: {activityError}</p>}


          {/* Interview Progress Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Interview Progress</h2>
            <p className={styles.cardDescription}>Track your interview preparation journey</p>
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span>Interviews Completed</span>
                <span className={styles.progressCount}>{interviewsCompleted} / 20</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${Math.min(100, (interviewsCompleted / 20) * 100)}%` }}></div>
              </div>
              <p className={styles.progressNote}>
                You&#39;re making great progress! Complete {Math.max(0, 20 - interviewsCompleted)} more interviews to reach your goal.
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{interviewsCompleted}</div>
                <div className={styles.statLabel}>Interviews Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{questionsAnswered}</div>
                <div className={styles.statLabel}>Questions Answered</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{daysSinceMember()}</div>
                <div className={styles.statLabel}>Days as Member</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{skillsMastered}</div>
                <div className={styles.statLabel}>Topics Practiced</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card - Now with dynamic data */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <p className={styles.cardDescription}>Your latest interview preparation activities</p>
            <div className={styles.activityList}>
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {/* You can choose an icon based on topic or a generic one */}
                      <span className={styles.iconInterview}>📝</span>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>
                        Practiced: {activity.topic || 'General Topic'}
                      </div>
                      <div className={styles.activityDate}>
                        {new Date(activity.created_at).toLocaleDateString()} - {new Date(activity.created_at).toLocaleTimeString()}
                      </div>
                      {/* Optionally, show a snippet of the question */}
                      {/* <p style={{fontSize: '0.85rem', color: '#555', marginTop: '4px'}}>
                        Question: {activity.question.substring(0, 50)}...
                      </p> */}
                    </div>
                    {/* You could add a link to the full session if you have a page for that */}
                    {/* <Link href={`/profile/history#session-${activity.session_id}`}>View</Link> */}
                  </div>
                ))
              ) : (
                <p><i>No recent activity to display.</i></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
