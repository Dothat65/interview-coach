"use client"

import { useState, useEffect } from "react"
import styles from "./profile.module.css"

export default function ProfilePage() {
  // Mock user data for development
  const mockUser = {
    id: "123456",
    email: "user@example.com",
    created_at: "2024-04-01T10:30:00Z",
    user_metadata: {
      full_name: "Demo User",
      provider: "email",
      // avatar_url: 'https://i.pravatar.cc/300' // Uncomment to show a profile picture
    },
  }

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Loading profile...</span>
      </div>
    )
  }

  // Calculate days since member joined
  const daysSinceMember = () => {
    const createdDate = new Date(user.created_at)
    const today = new Date()
    const diffTime = Math.abs(today - createdDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileGrid}>
        {/* Profile Summary Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url || "/placeholder.svg"} alt="Profile" />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className={styles.badgeContainer}>
                <span className={styles.badge}>Premium</span>
              </div>
            </div>
            <h1 className={styles.profileName}>{user.user_metadata?.full_name || "User"}</h1>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>

            {user.user_metadata?.provider && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Sign-in Method</span>
                <span className={styles.value}>{user.user_metadata.provider}</span>
              </div>
            )}

            <div className={styles.detailItem}>
              <span className={styles.label}>Account Type</span>
              <span className={styles.value}>
                <span className={styles.premiumTag}>Premium</span>
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Interviews Completed</span>
              <span className={styles.value}>12</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.profileActions}>
            <button className={styles.editButton}>
              <span className={styles.buttonIcon}>✏️</span>
              Edit Profile
            </button>
            <button className={styles.logoutButton}>
              <span className={styles.buttonIcon}>🚪</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className={styles.activitySection}>
          {/* Interview Progress Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Interview Progress</h2>
            <p className={styles.cardDescription}>Track your interview preparation journey</p>

            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span>Interviews Completed</span>
                <span className={styles.progressCount}>12 / 20</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: "60%" }}></div>
              </div>
              <p className={styles.progressNote}>
                You&#39;re making great progress! Complete 8 more interviews to reach your goal.
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>12</div>
                <div className={styles.statLabel}>Interviews Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>24</div>
                <div className={styles.statLabel}>Questions Answered</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{daysSinceMember()}</div>
                <div className={styles.statLabel}>Days as Member</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>4</div>
                <div className={styles.statLabel}>Skills Mastered</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <p className={styles.cardDescription}>Your latest interview preparation activities</p>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <span className={styles.iconInterview}>📝</span>
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Technical Interview Practice</div>
                  <div className={styles.activityDate}>2 days ago</div>
                </div>
                <div className={styles.activityScore}>85/100</div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <span className={styles.iconResource}>📚</span>
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Behavioral Interview Guide</div>
                  <div className={styles.activityDate}>4 days ago</div>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <span className={styles.iconInterview}>📝</span>
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Mock Interview - Frontend</div>
                  <div className={styles.activityDate}>1 week ago</div>
                </div>
                <div className={styles.activityScore}>92/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
