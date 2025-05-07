// app/profile/history/page.js

// Import the server-side Supabase client helper and redirect function
import { createClient } from '@/lib/utils/supabase/server' // Adjust path if needed
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './history.module.css'; // Import the new CSS module
import { ArrowLeft, Home, FileText, MessageSquare, Clock } from 'lucide-react'; // Example icons

export default async function InterviewHistoryPage() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('InterviewHistoryPage: No user session, redirecting to login.');
    redirect('/login');
  }
  const userId = user.id;
  console.log('InterviewHistoryPage: User session found for user ID:', userId);

  let allRounds = [];
  let fetchError = null;
  try {
    const { data, error } = await supabase
      .from('interview_rounds')
      .select('id, session_id, created_at, topic, question, answer, feedback')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Fetch newest rounds first overall

    if (error) throw error;
    allRounds = data || [];
    console.log(`Fetched ${allRounds.length} rounds for user ${userId}`);
  } catch (err) {
    console.error('InterviewHistoryPage: Error fetching interview rounds:', err);
    fetchError = err.message;
  }

  const sessionsMap = new Map();
  if (allRounds.length > 0) {
    allRounds.forEach(round => {
      if (!sessionsMap.has(round.session_id)) {
        sessionsMap.set(round.session_id, {
          sessionId: round.session_id,
          topic: round.topic,
          // This will be refined in the next loop to be the earliest round's created_at
          startedAt: round.created_at,
          rounds: []
        });
      }
      sessionsMap.get(round.session_id).rounds.push(round);
    });

    // Refine startedAt and sort rounds within each session
    sessionsMap.forEach(session => {
      // Sort rounds chronologically (oldest first within a session)
      session.rounds.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      // The first round (after sorting) is the start of the session
      if (session.rounds.length > 0) {
        session.startedAt = session.rounds[0].created_at;
      }
    });
  }

  // Sort sessions by their determined startedAt date, newest session first
  const groupedSessions = Array.from(sessionsMap.values()).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  console.log(`Grouped into ${groupedSessions.length} sessions.`);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerNav}>
            <Link href="/profile" className={styles.backLink}>
                <ArrowLeft size={18} /> Back to Profile
            </Link>
            <Link href="/" className={styles.homeLink}>
                <Home size={18} /> Go Home
            </Link>
        </div>
        <h1 className={styles.pageTitle}>Your Interview Journey</h1>
        <p className={styles.pageSubtitle}>
          Review your past mock interview sessions, questions, answers, and feedback.
        </p>
      </header>

      <main className={styles.mainContent}>
        {fetchError && (
          <p className={styles.errorMesssage}>
            Error loading history: {fetchError}
          </p>
        )}

        {!fetchError && groupedSessions.length === 0 && (
          <div className={styles.noHistoryContainer}>
            <FileText size={64} strokeWidth={1} style={{marginBottom: '20px', color: '#6c757d'}} />
            <p className={styles.noHistoryText}>You haven't completed any mock interviews yet.</p>
            <Link href="/mockInterviewSelection" className={styles.ctaButton}>
             Start Your First Mock Interview
            </Link>
          </div>
        )}

        {!fetchError && groupedSessions.map((session) => (
          <div key={session.sessionId} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <h2 className={styles.sessionTitle}>
                Session: {session.topic || 'General Topic'}
              </h2>
              <p className={styles.sessionDetails}>
                <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Started on: {new Date(session.startedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                &nbsp;at {new Date(session.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                <span style={{ opacity: 0.7, marginLeft: '10px' }}>(ID: {session.sessionId.substring(0,8)}...)</span>
              </p>
            </div>

            <div className={styles.roundsContainer}>
              {session.rounds.map((round, index) => (
                <div key={round.id} className={styles.roundItem}>
                  <h3 className={styles.roundTitle}>
                    <MessageSquare size={20} style={{ marginRight: '8px', color: '#007bff', verticalAlign: 'bottom' }} />
                    Question {index + 1}
                  </h3>
                  <div className={styles.roundField}>
                    <strong>Question:</strong>
                    <p>{round.question}</p>
                  </div>
                  <div className={styles.roundField}>
                    <strong>Your Answer:</strong>
                    <p>{round.answer || <em>No answer recorded.</em>}</p>
                  </div>
                  <div className={styles.roundField}>
                    <strong>Feedback:</strong>
                    <p>{round.feedback || <em>No feedback available.</em>}</p>
                  </div>
                  <span className={styles.roundTimestamp}>
                    Answered: {new Date(round.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Interview Coach. Keep improving!</p>
      </footer>
    </div>
  );
}
