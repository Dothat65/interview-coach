"use client";

import { useRouter } from "next/navigation";
import styles from "./mockInterviewSelection.module.css";
import { useEffect, useState } from "react";

export default function MockInterviewSelectionPage() {
    const router = useRouter();
    const [selectedTopic, setSelectedTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState("3");

    const topics = [
        "Software Engineering",
        "Data Science",
        "Cybersecurity",
        "Finance",
        "Marketing",
        "Product Management",
        "Healthcare",
        "Behavioral"
    ];

    const handleStartInterview = () => {
        if (!selectedTopic || !numQuestions) return;
        sessionStorage.setItem("interviewTopic", selectedTopic);
        sessionStorage.setItem("interviewQuestions", numQuestions);
        router.push("/mockInterview");
    };

    useEffect(() => {
        document.title = "Mock Interview Selection";
    }, []);

    return (
        <div className={styles["mockInterview-container"]}>
            <h1>Options</h1>

            <select
                className={styles["mockInterview-dropdown"]}
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
            >
                <option value="">-- Select a topic --</option>
                {topics.map((topic) => (
                    <option key={topic} value={topic}>
                        {topic}
                    </option>
                ))}
            </select>

            <select
                className={styles["mockInterview-dropdown"]}
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
            >
                <option value="1">1 Question</option>
                <option value="2">2 Questions</option>
                <option value="3">3 Questions</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
            </select>

            <button
                className={styles["mockInterview-submitButton"]}
                onClick={handleStartInterview}
                disabled={!selectedTopic}
            >
                Start Interview
            </button>
        </div>
    );
}