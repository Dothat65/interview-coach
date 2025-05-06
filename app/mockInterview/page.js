"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./mockInterview.module.css";

export default function MockInterviewPage() {
  const [question, setQuestion] = useState("Question loading...");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [questionsNum, setQuestionsNum] = useState(1);
  const [topic, setTopic] = useState("");
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)

  const recognitionRef = useRef(null);

  const router = useRouter();

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
      setShowNext(true);
      setHistory((prevHistory) => [
        ...prevHistory,
        { question, answer: response, feedback: data.feedback },
      ]);
    } catch (err) {
      console.error("Error submitting:", err);
      setFeedback("Failed to connect to backend.");
    }
    setLoading(false);
  }

  const handleNext = async () => {
    if (currentQuestionNum >= questionsNum) {
      setFinished(true);
      return;
    }
    const questionRes = await fetch("http://localhost:8000/get_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });
    const questionData = await questionRes.json();
    setQuestion(questionData.question);
    setCurrentQuestionNum((prev) => prev + 1);
    setResponse("");
    setFeedback("");
    setShowNext(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;

      if (result.isFinal) {
        setResponse((prevResponse) => prevResponse + text);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    document.title = "Mock Interview";

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }

    const storedTopic = sessionStorage.getItem("interviewTopic");
    const storedQuestions = sessionStorage.getItem("interviewQuestions");

    if (!storedTopic || !storedQuestions) {
      router.push("/");
      return;
    }

    setTopic(storedTopic);
    setQuestionsNum(parseInt(storedQuestions));

    const fetchInitialQuestion = async () => {
      const res = await fetch("http://localhost:8000/get_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: storedTopic }),
      });
      const data = await res.json();
      setQuestion(data.question);
    };
    fetchInitialQuestion();
  }, [router]);

  return (
    <div className={styles["mockInterview-container"]}>
      {!finished ? (
        <>
          <h1 className={styles["mockInterview-question"]}>
            Question {currentQuestionNum} of {questionsNum}
          </h1>

          <p className={styles["mockInterview-prompt"]}>
            {question}
          </p>

          <textarea
            className={styles["mockInterview-textarea"]}
            placeholder="Enter your response..."
            value={response}
            onChange={handleChange}
          />

          {speechSupported && (
            <button
              onClick={toggleListening}
              className={styles["mockInterview-microphoneIcon"]}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>
          )}

          <button
            className={styles["mockInterview-submitButton"]}
            onClick={showNext ? handleNext : handleSubmit}
            disabled={loading || (!showNext && response.length === 0)}
          >
            {loading
              ? "Submitting..."
              : showNext
                ? currentQuestionNum === questionsNum
                  ? "Finish"
                  : "Next"
                : "Submit"}
          </button>

          {loading && (
            <div className={styles["mockInterview-spinner"]}></div>
          )}

          {feedback && (
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
            {history.map((item, index) => (
              <div key={index} style={{ marginBottom: "30px" }}>
                <h2>Question {index + 1}</h2>
                <p><strong>Question:</strong> {item.question}</p>
                <p><strong>Your Answer:</strong> {item.answer}</p>
                <p><strong>Feedback:</strong> {item.feedback}</p>
              </div>
            ))}
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