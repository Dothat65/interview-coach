"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./answerQuestion.module.css";

export default function AnswerQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Get the question and metadata from URL parameters
    const questionText = searchParams.get("question");
    const topicText = searchParams.get("topic");
    const difficultyLevel = searchParams.get("difficulty");

    if (questionText) {
      setQuestion(decodeURIComponent(questionText));
      setTopic(topicText ? decodeURIComponent(topicText) : "");
      setDifficulty(difficultyLevel ? decodeURIComponent(difficultyLevel) : "");
    } else {
      // If no question provided, redirect back to questions page
      router.push("/popularquestions");
    }

    // Check if speech recognition is supported
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setSpeechSupported(false);
    }
  }, [searchParams, router]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  // Speech recognition toggle function
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;

      if (result.isFinal) {
        setAnswer((prevAnswer) => prevAnswer + " " + text);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Send the answer to the backend for feedback - Use the new endpoint
      const response = await fetch("http://localhost:8000/get_structured_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: answer }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const data = await response.json();
      setFeedback(data.feedback); // This will now be a JSON object
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback({
        score: 0,
        strengths: ["Unable to evaluate your answer"],
        areas_for_improvement: ["Could not evaluate due to a technical error"],
        summary:
          "Error: Could not get feedback. Is the backend server running?",
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    router.push("/popularquestions");
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionCard}>
        <div className={styles.header}>
          <h1>Practice Interview Question</h1>
          {topic && <div className={styles.topic}>{topic}</div>}
          {difficulty && (
            <div
              className={styles.difficulty}
              data-difficulty={difficulty.toLowerCase()}
            >
              {difficulty}
            </div>
          )}
        </div>

        <div className={styles.question}>{question}</div>

        <div className={styles.answerContainer}>
          <textarea
            className={styles.answerArea}
            placeholder="Type your answer here..."
            value={answer}
            onChange={handleAnswerChange}
            disabled={submitted}
          />

          {/* Speech Recognition Button */}
          {speechSupported && !submitted && (
            <button
              onClick={toggleListening}
              className={styles.micButton}
              type="button"
            >
              {isListening ? "🔴 Stop" : "🎙️ Speak"}
            </button>
          )}
        </div>

        {/* Speech transcript display */}
        {isListening && (
          <div className={styles.listeningIndicator}>
            <p>
              <strong>Listening:</strong> Recording your answer...
            </p>
          </div>
        )}

        {!submitted ? (
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        ) : (
          <div className={styles.feedbackSection}>
            <h2>Interview Answer Feedback</h2>

            {feedback && (
              <>
                <div className={styles.scoreContainer}>
                  <div
                    className={`${styles.scoreCircle} ${
                      feedback.score >= 75
                        ? styles.scoreHigh
                        : feedback.score >= 60
                        ? styles.scoreMedium
                        : styles.scoreLow
                    }`}
                    style={{
                      "--score-percentage": `${feedback.score}%`,
                    }}
                  >
                    <div className={styles.scoreInner}>
                      <span className={styles.scoreValue}>
                        {feedback.score}
                      </span>
                      <span className={styles.scoreLabel}>Score</span>
                    </div>
                  </div>
                </div>

                <div className={styles.feedbackDetails}>
                  <div className={styles.feedbackBlock}>
                    <h3 className={styles.feedbackSectionTitle}>
                      <span className={styles.feedbackIcon}>✅</span> Strengths
                    </h3>
                    <ul className={styles.feedbackList}>
                      {feedback.strengths.map((strength, index) => (
                        <li key={`strength-${index}`}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.feedbackBlock}>
                    <h3 className={styles.feedbackSectionTitle}>
                      <span className={styles.feedbackIcon}>🔍</span> Areas for
                      Improvement
                    </h3>
                    <ul className={styles.feedbackList}>
                      {feedback.areas_for_improvement.map((area, index) => (
                        <li key={`area-${index}`}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.feedbackSummary}>
                    <p>
                      <strong>Summary:</strong> {feedback.summary}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className={styles.actionButtons}>
              <button
                className={styles.tryAnotherButton}
                onClick={handleTryAnother}
              >
                Try Another Question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}