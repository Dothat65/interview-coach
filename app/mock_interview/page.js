"use client";

import { useEffect, useState } from "react";
import styles from "./mockInterview.module.css";

export default function Home() {
  const [question, setQuestion] = useState("Question loading..."); 
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const questionsNum = 5

  const handleChange = (e) => {
    setResponse(e.target.value);
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/get_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      });
      const data = await res.json();
      setFeedback(data.feedback);

      if (currentQuestionNum < questionsNum) {
        const questionRes = await fetch("http://localhost:8000/get_question");
        const questionData = await questionRes.json();
        setQuestion(questionData.question);
        setCurrentQuestionNum((prev) => prev + 1);
        setResponse("");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setFeedback("Failed to connect to backend.");
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      const res = await fetch("http://localhost:8000/get_question");
      const data = await res.json();
      setQuestion(data.question);
    };
    fetchInitialQuestion();
  }, []);

  return (
    <div className={styles["mockInterview-container"]}>
      <h1 className={styles["mockInterview-question"]}>Question {currentQuestionNum} of {questionsNum}</h1>

      <p className={styles["mockInterview-prompt"]}>
        {question}
      </p>

      <textarea
        className={styles["mockInterview-textarea"]}
        placeholder="Enter your response..."
        value={response}
        onChange={handleChange}
      />

      <button
        className={styles["mockInterview-submitButton"]}
        onClick={handleSubmit}
        disabled={loading || response.length === 0}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {feedback && (
        <div className={styles["mockInterview-feedback"]}>
          <h2>Feedback</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>

  );
}
