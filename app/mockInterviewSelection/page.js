// app/mockInterviewSelection/page.js
"use client";

import { useRouter } from "next/navigation";
import styles from "./mockInterviewSelection.module.css";
import { useEffect, useState } from "react";
import { ListChecks, PlayCircle, ChevronDown } from "lucide-react"; // Added icons

export default function MockInterviewSelectionPage() {
    const router = useRouter();
    const [selectedTopic, setSelectedTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState("3"); // Default to 3 questions

    const topics = [
        "Artificial Intelligence", "Behavioral", "Blockchain", "Business Analysis",
        "Cloud Computing", "Creative/Design", "Cybersecurity", "Customer Service",
        "Data Science", "Database Administration", "DevOps", "Education and Training",
        "Embedded Systems", "Finance", "Game Development", "Healthcare",
        "Human Resources", "IT Support", "Legal and Compliance", "Machine Learning",
        "Marketing", "Mobile App Development", "Network Engineering",
        "Operations Management", "Product Management", "Project Management", "Sales",
        "Scientific Research", "Software Engineering", "UI/UX Design"
    ];

    const handleStartInterview = () => {
        if (!selectedTopic || !numQuestions) {
            alert("Please select a topic and the number of questions.");
            return;
        }
        sessionStorage.setItem("interviewTopic", selectedTopic);
        sessionStorage.setItem("interviewQuestions", numQuestions);
        router.push("/mockInterview");
    };

    useEffect(() => {
        document.title = "Setup Mock Interview"; // More descriptive title
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.selectionBox}>
                <div className={styles.header}>
                    <ListChecks size={36} className={styles.headerIcon} />
                    <h1 className={styles.title}>Setup Your Mock Interview</h1>
                    <p className={styles.subtitle}>
                        Choose a topic and the number of questions to begin your practice session.
                    </p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="topic-select" className={styles.label}>
                        Select Interview Topic:
                    </label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="topic-select"
                            className={styles.dropdown}
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="" disabled>-- Choose a topic --</option>
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={20} className={styles.selectArrow} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="questions-select" className={styles.label}>
                        Number of Questions:
                    </label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="questions-select"
                            className={styles.dropdown}
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(e.target.value)}
                        >
                            <option value="1">1 Question</option>
                            <option value="2">2 Questions</option>
                            <option value="3">3 Questions</option>
                            <option value="5">5 Questions</option>
                            <option value="10">10 Questions</option>
                        </select>
                        <ChevronDown size={20} className={styles.selectArrow} />
                    </div>
                </div>

                <button
                    className={styles.submitButton}
                    onClick={handleStartInterview}
                    disabled={!selectedTopic || !numQuestions}
                >
                    <PlayCircle size={20} style={{ marginRight: '10px' }} />
                    Start Interview
                </button>
            </div>
        </div>
    );
}
