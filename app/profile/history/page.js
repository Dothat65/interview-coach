// app/profile/history/page.js

// Import the server-side Supabase client helper and redirect function
import { createClient } from '@/lib/utils/supabase/server' // Adjust path if needed
import { redirect } from 'next/navigation';
import Link from 'next/link'; // For a "back to profile" or "home" link

// Import basic styles (you can create a CSS module for this page later)
// For now, we might use some inline styles or very basic global ones if available.

// Make the default export function async
export default async function InterviewHistoryPage() {
  // 1. Create the server-side Supabase client
  const supabase = createClient();

  // 2. Get authenticated user data
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 3. Redirect if user is not logged in
  if (authError || !user) {
    console.log('InterviewHistoryPage: No user session, redirecting to login.');
    redirect('/login'); // Adjust path if needed
  }
  const userId = user.id;
  console.log('InterviewHistoryPage: User session found for user ID:', userId);

  // 4. Fetch all interview rounds for the logged-in user
  let allRounds = [];
  let fetchError = null;
  try {
    const { data, error } = await supabase
      .from('interview_rounds') // Your table name
      .select('id, session_id, created_at, topic, question, answer, feedback') // Select necessary columns
      .eq('user_id', userId)
      .order('session_id', { ascending: false }) // Group by session
      .order('created_at', { ascending: true }); // Order rounds within a session chronologically

    if (error) {
      throw error;
    }
    allRounds = data || []; // Ensure allRounds is an array
    console.log(`Fetched ${allRounds.length} rounds for user ${userId}`);
  } catch (err) {
    console.error('InterviewHistoryPage: Error fetching interview rounds:', err);
    fetchError = err.message;
  }

  // 5. Group rounds by session_id
  const sessionsMap = new Map(); // Use a Map for easier grouping and ordering
  if (allRounds.length > 0) {
    allRounds.forEach(round => {
      if (!sessionsMap.has(round.session_id)) {
        // Initialize the session if it's the first time we see this session_id
        sessionsMap.set(round.session_id, {
          sessionId: round.session_id,
          topic: round.topic, // Assuming topic is consistent per session, take from first round
          // Use the created_at of the first round in the session as the session's start time
          // Since we ordered by created_at ascending within session_id, this should be the earliest.
          startedAt: round.created_at,
          rounds: []
        });
      }
      // Add the current round to this session's list of rounds
      sessionsMap.get(round.session_id).rounds.push(round);
    });
  }

  // Convert the Map values to an array and sort sessions by startedAt (newest first)
  const groupedSessions = Array.from(sessionsMap.values()).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  console.log(`Grouped into ${groupedSessions.length} sessions.`);


  // 6. Render the page
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#333' }}>Interview History</h1>
        <Link href="/profile" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          &larr; Back to Profile
        </Link>
      </div>

      {fetchError && (
        <p style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
          Error loading history: {fetchError}
        </p>
      )}

      {!fetchError && groupedSessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>You have no past interview sessions recorded.</p>
          <Link href="/mockInterviewSelection" style={{ // Assuming this is your selection page
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
            }}>
             Start a New Mock Interview
          </Link>
        </div>
      )}

      {!fetchError && groupedSessions.map((session) => (
        <div key={session.sessionId} style={{
          marginBottom: '40px',
          padding: '25px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#1a1a1a',
            borderBottom: '2px solid #007bff',
            paddingBottom: '10px',
            marginBottom: '20px'
          }}>
            Session: {session.topic || 'General Topic'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '20px' }}>
            Started on: {new Date(session.startedAt).toLocaleString()} (Session ID: {session.sessionId.substring(0,8)}...)
          </p>

          {session.rounds.map((round, index) => (
            <div key={round.id} style={{
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              borderLeft: '5px solid #007bff'
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>
                Question {index + 1}
              </h3>
              <p style={{ marginBottom: '8px' }}><strong>Question:</strong> {round.question}</p>
              <p style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}><strong>Your Answer:</strong> {round.answer}</p>
              <p style={{ whiteSpace: 'pre-wrap' }}><strong>Feedback:</strong> {round.feedback}</p>
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '10px', textAlign: 'right' }}>
                Answered at: {new Date(round.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
