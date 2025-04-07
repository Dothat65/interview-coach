"use client";

import { useState } from "react";
import styles from "./mockInterview.module.css";

export default function Home()
{
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const questionsNum = 5

  const handleChange = (e) =>
  {
    setResponse(e.target.value);
  }

  const handleSubmit = async () =>
  {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFeedback(response);
    console.log("Submitted response:", response);
    if (currentQuestionNum < questionsNum) {
      setCurrentQuestionNum((prev) => prev + 1);
    }
    setLoading(false);
  }

  return (
    <div className={styles["mockInterview-container"]}>
      <h1 className={styles["mockInterview-question"]}>Question {currentQuestionNum} of {questionsNum}</h1>

      <p className={styles["mockInterview-prompt"]}>
        Tell me about a time you faced a difficult challenge at work and how you overcame it.
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
