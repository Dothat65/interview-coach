// app/mockInterview/page.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./mockInterview.module.css";
// --- Import your browser Supabase client ---
// Ensure this path is correct for your project structure
import { supabase } from "@/lib/supabaseClient";

export default function MockInterviewPage() {
  const [question, setQuestion] = useState("Question loading...");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state for all async operations
  const [showNext, setShowNext] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [questionsNum, setQuestionsNum] = useState(1);
  const [topic, setTopic] = useState("");
  const [finished, setFinished] = useState(false);

  // --- State variables from 'amaan' branch ---
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const router = useRouter();

  // --- Consolidated useEffect for all initial setup (from 'amaan' branch) ---
  useEffect(() => {
    document.title = "Mock Interview";

    // 1. Generate sessionId for this interview attempt
    setSessionId(crypto.randomUUID());

    // 2. Fetch the logged-in user's ID
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("User ID fetched:", user.id);
      } else {
        console.warn("User not logged in. Mock interview can proceed, but progress will not be saved to DB.");
        // Optionally, you could redirect to login if saving is mandatory:
        // alert("You must be logged in to start a mock interview.");
        // router.push('/login');
        // return; // Stop further setup if redirecting
      }
    };
    fetchUser();

    // 3. Check for Speech Recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
      console.log("Speech recognition not supported by this browser.");
    }

    // 4. Get topic and number of questions from session storage
    const storedTopic = sessionStorage.getItem("interviewTopic");
    const storedQuestions = sessionStorage.getItem("interviewQuestions");

    if (!storedTopic || !storedQuestions) {
      console.log("Topic or questions count not found in session storage, redirecting to home.");
      alert("Interview setup not found. Please select topic and questions again.");
      router.push("/"); // Or to a topic selection page
      return; // Stop further execution
    }

    setTopic(storedTopic);
    setQuestionsNum(parseInt(storedQuestions));

    // 5. Fetch the initial question if topic is available
    const fetchInitialQuestion = async (currentTopic) => {
      console.log("Fetching initial question for topic:", currentTopic);
      setLoading(true);
      setQuestion("Loading initial question...");
      try {
        const res = await fetch("http://localhost:8000/get_question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: currentTopic }),
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} - ${await res.text()}`);
        }
        const data = await res.json();
        setQuestion(data.question || "No question received from backend.");
      } catch (err) {
        console.error("Error fetching initial question:", err);
        setQuestion("Failed to load question. Please ensure the backend is running and check console for errors.");
      } finally {
        setLoading(false);
      }
    };

    if (storedTopic) {
      fetchInitialQuestion(storedTopic);
    } else {
        setQuestion("Topic not available to fetch question."); // Should be caught by redirect above
    }

  }, [router]); // router is a dependency for router.push

  const handleChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async () => {
    if (response.trim() === "") {
        alert("Please enter your response.");
        return;
    }
    setLoading(true);
    setFeedback(""); // Clear previous feedback
    try {
      const res = await fetch("http://localhost:8000/get_feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} - ${await res.text()}`);
      }
      const data = await res.json();
      setFeedback(data.feedback || "No feedback received.");
      setShowNext(true);

      const newHistoryItem = { question, answer: response, feedback: data.feedback };
      setLocalHistory((prevHistory) => [...prevHistory, newHistoryItem]);

      if (userId && sessionId) {
        console.log("Attempting to save round to DB:", { sessionId, userId, topic, question, response, feedback: data.feedback });
        const { error: insertError } = await supabase
          .from('interview_rounds') // Corrected table name
          .insert([{
            session_id: sessionId,
            user_id: userId,
            topic: topic,
            question: question,
            answer: response,
            feedback: data.feedback,
          }]);
        if (insertError) {
          console.error("Error saving interview round to Supabase:", insertError);
        } else {
          console.log("Interview round saved successfully to Supabase.");
        }
      } else {
        console.warn("Cannot save round to DB: User ID or Session ID is missing. Current IDs - UserID:", userId, "SessionID:", sessionId);
      }
    } catch (err) {
      console.error("Error submitting response or getting feedback:", err);
      setFeedback("Failed to connect to backend or process response. Check console for errors.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestionNum >= questionsNum) {
      setFinished(true);
      return;
    }
    setLoading(true);
    setResponse("");
    setFeedback("");
    setShowNext(false);
    setQuestion("Loading next question...");
    try {
      const questionRes = await fetch("http://localhost:8000/get_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!questionRes.ok) {
        throw new Error(`HTTP error! status: ${questionRes.status} - ${await questionRes.text()}`);
      }
      const questionData = await questionRes.json();
      setQuestion(questionData.question || "No question received for next round.");
      setCurrentQuestionNum((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching next question:", err);
      setQuestion("Failed to load next question. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // toggleListening function from 'amaan' branch
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      setIsListening(false);
      console.log("Speech recognition not supported by this browser.");
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    setIsListening(true);
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = true; // Keep listening even after pauses
    recognitionRef.current.interimResults = true; // Get interim results

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscriptSegment = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptSegment += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      // Update response with final segments, potentially show interim if desired
      if (finalTranscriptSegment) {
         setResponse((prevResponse) => prevResponse + finalTranscriptSegment + ' ');
      }
      // You could also set interimTranscript to a temporary state to show it live
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setSpeechSupported(false);
      setIsListening(false);
      if (event.error === 'no-speech') {
        alert("No speech detected. Please try again.");
      } else if (event.error === 'audio-capture') {
        alert("Audio capture error. Please ensure your microphone is working and permissions are granted.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone access in your browser settings.");
      } else {
        alert(`Speech recognition error: ${event.error}`);
      }
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      setIsListening(false);
      setSpeechSupported(false);
      alert("Could not start speech recognition. Please check microphone permissions.");
    }
  };

  return (
    <div className={styles["mockInterview-container"]}>
      {!finished ? (
        <>
          <h1 className={styles["mockInterview-question"]}>
            Question {currentQuestionNum} of {questionsNum}
          </h1>
          <p className={styles["mockInterview-prompt"]}>{question}</p>
          <textarea
            className={styles["mockInterview-textarea"]}
            placeholder="Enter your response..."
            value={response}
            onChange={handleChange}
            disabled={loading || isListening} // Disable textarea while loading or listening
          />
          {/* Microphone button from 'amaan' branch */}
          {speechSupported && (
            <button
              onClick={toggleListening}
              className={`${styles["mockInterview-microphoneIcon"]} ${isListening ? styles.listening : ''}`}
              disabled={loading} // Disable mic button while other operations are loading
              title={isListening ? "Stop Listening" : "Start Listening"}
            >
              {isListening ? '🔴 Stop' : '🎙️ Speak'}
            </button>
          )}
          <button
            className={styles["mockInterview-submitButton"]}
            onClick={showNext ? handleNext : handleSubmit}
            disabled={loading || (!showNext && response.trim().length === 0) || isListening} // Disable while loading or listening
          >
            {loading
              ? "Processing..."
              : showNext
                ? currentQuestionNum >= questionsNum
                  ? "Finish & View Summary"
                  : "Next Question"
                : "Submit Answer"}
          </button>
          {loading && <div className={styles["mockInterview-spinner"]}></div>}
          {feedback && !loading && (
            <div className={styles["mockInterview-feedback"]}>
              <h2>Feedback</h2>
              <p>{feedback}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className={styles["mockInterview-question"]}>Interview Summary</h1>
          <div className={styles["mockInterview-feedback"]}>
            {localHistory.map((item, index) => ( // Corrected to use localHistory
              <div key={index} style={{ marginBottom: "30px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                <h2>Question {index + 1}</h2>
                <p><strong>Topic:</strong> {topic}</p>
                <p><strong>Question:</strong> {item.question}</p>
                <p><strong>Your Answer:</strong> {item.answer}</p>
                <p><strong>Feedback:</strong> {item.feedback}</p>
              </div>
            ))}
            {localHistory.length === 0 && <p>No rounds completed in this session.</p>}
          </div>
          <button
            className={styles["mockInterview-submitButton"]}
            onClick={() => router.push("/")}
          >
            Return Home
          </button>
        </>
      )}
    </div>
  );
}
