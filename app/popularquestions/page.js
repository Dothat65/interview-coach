"use client"

import { useState, useEffect } from "react"
import styles from "./popularquestions.module.css"

// Mock data for interview questions by industry
const industriesData = [
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    color: "#6366f1",
    questions: [
      {
        id: "tech1",
        question: "Explain the difference between REST and GraphQL APIs.",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "tech2",
        question: "What are closures in JavaScript and how would you use them?",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "tech3",
        question: "Describe the principles of responsive design.",
        difficulty: "Easy",
        frequency: "High",
      },
      {
        id: "tech4",
        question: "How would you optimize a website's performance?",
        difficulty: "Medium",
        frequency: "Medium",
      },
      {
        id: "tech5",
        question: "Explain the concept of microservices architecture.",
        difficulty: "Hard",
        frequency: "Medium",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "💰",
    color: "#22c55e",
    questions: [
      {
        id: "fin1",
        question: "What is the difference between GAAP and IFRS?",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "fin2",
        question: "Explain the concept of time value of money.",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "fin3",
        question: "How would you evaluate a company's financial health?",
        difficulty: "Hard",
        frequency: "High",
      },
      {
        id: "fin4",
        question: "What factors affect a company's weighted average cost of capital (WACC)?",
        difficulty: "Hard",
        frequency: "Medium",
      },
      {
        id: "fin5",
        question: "Describe the key components of a cash flow statement.",
        difficulty: "Medium",
        frequency: "Medium",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    color: "#3b82f6",
    questions: [
      {
        id: "health1",
        question: "What experience do you have with electronic health records (EHR) systems?",
        difficulty: "Easy",
        frequency: "High",
      },
      {
        id: "health2",
        question: "How do you ensure patient confidentiality and HIPAA compliance?",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "health3",
        question: "Describe a situation where you had to deal with a difficult patient.",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "health4",
        question: "What strategies would you implement to reduce medical errors?",
        difficulty: "Hard",
        frequency: "Medium",
      },
      {
        id: "health5",
        question: "How do you stay current with medical research and advancements?",
        difficulty: "Medium",
        frequency: "Medium",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "📊",
    color: "#f59e0b",
    questions: [
      {
        id: "mkt1",
        question: "How would you measure the success of a marketing campaign?",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "mkt2",
        question: "Describe your experience with SEO and SEM strategies.",
        difficulty: "Medium",
        frequency: "High",
      },
      {
        id: "mkt3",
        question: "How would you approach building a brand strategy for a new product?",
        difficulty: "Hard",
        frequency: "Medium",
      },
      {
        id: "mkt4",
        question: "What social media platforms would you recommend for a B2B company and why?",
        difficulty: "Medium",
        frequency: "Medium",
      },
      {
        id: "mkt5",
        question: "How do you stay updated with the latest marketing trends?",
        difficulty: "Easy",
        frequency: "Medium",
      },
    ],
  },
]

export default function InterviewQuestionsPage() {
  const [industries, setIndustries] = useState(industriesData)
  const [activeIndustry, setActiveIndustry] = useState(industriesData[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  
  // New speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [speechSupported, setSpeechSupported] = useState(true)
  
  // Check if speech recognition is supported
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const currentIndustry = industries.find((ind) => ind.id === activeIndustry)

    if (currentIndustry) {
      let filtered = [...currentIndustry.questions]

      // Apply search filter
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      // Apply difficulty filter
      if (difficultyFilter !== "All") {
        filtered = filtered.filter((q) => q.difficulty === difficultyFilter)
      }

      setFilteredQuestions(filtered)
    }
  }, [activeIndustry, industries, searchQuery, difficultyFilter])

  // Speech recognition function
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }
    
    setIsListening(true);
    setTranscript("");
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      
      setTranscript(text);
      if (result.isFinal) {
        setSearchQuery(text);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  const stopListening = () => {
    setIsListening(false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
  };

  const handleIndustryChange = (industryId) => {
    setActiveIndustry(industryId)
    setSearchQuery("")
    setDifficultyFilter("All")
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(difficulty)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Loading interview questions...</span>
      </div>
    )
  }

  const currentIndustry = industries.find((ind) => ind.id === activeIndustry)
  const difficultyColors = {
    Easy: "#22c55e",
    Medium: "#f59e0b",
    Hard: "#ef4444",
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Popular Interview Questions</h1>
        <p className={styles.subtitle}>
          Prepare for your next interview with these commonly asked questions from top industries
        </p>
      </div>

      <div className={styles.content}>
        {/* Industry Selection */}
        <div className={styles.industriesContainer}>
          <h2 className={styles.sectionTitle}>Industries</h2>
          <div className={styles.industryTabs}>
            {industries.map((industry) => (
              <button
                key={industry.id}
                className={`${styles.industryTab} ${activeIndustry === industry.id ? styles.activeTab : ""}`}
                onClick={() => handleIndustryChange(industry.id)}
                style={{
                  "--industry-color": industry.color,
                }}
              >
                <span className={styles.industryIcon}>{industry.icon}</span>
                <span className={styles.industryName}>{industry.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions Section */}
        <div className={styles.questionsSection}>
          <div className={styles.questionsHeader}>
            <div className={styles.industryInfo}>
              <span className={styles.industryIconLarge} style={{ backgroundColor: currentIndustry.color }}>
                {currentIndustry.icon}
              </span>
              <h2 className={styles.industryTitle}>{currentIndustry.name} Interview Questions</h2>
            </div>

            <div className={styles.filters}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className={styles.searchIcon}>🔍</span>
                
                {/* Speech Recognition Button */}
                {speechSupported && (
                  <button 
                    onClick={toggleListening}
                    className={styles.micButton}
                    style={{
                      background: isListening ? '#ef4444' : '#6366f1',
                      padding: '6px 10px',
                      borderRadius: '50%',
                      border: 'none',
                      marginLeft: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isListening ? '🛑' : '🎤'}
                  </button>
                )}
              </div>

              {/* Speech transcript display */}
              {isListening && (
                <div style={{
                  padding: '8px 12px',
                  marginTop: '8px',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <p style={{ margin: 0 }}>
                    <strong>Listening:</strong> {transcript || "Speak now..."}
                  </p>
                </div>
              )}

              <div className={styles.difficultyFilter}>
                <span className={styles.filterLabel}>Difficulty:</span>
                <div className={styles.filterOptions}>
                  {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`${styles.filterOption} ${difficultyFilter === difficulty ? styles.activeFilter : ""}`}
                      onClick={() => handleDifficultyChange(difficulty)}
                      style={{
                        "--filter-color": difficulty === "All" ? "#6366f1" : difficultyColors[difficulty] || "#6366f1",
                      }}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.questionsList}>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div key={question.id} className={styles.questionCard}>
                  <div className={styles.questionContent}>
                    <p className={styles.questionText}>{question.question}</p>
                    <div className={styles.questionMeta}>
                      <span
                        className={styles.difficultyTag}
                        style={{ backgroundColor: difficultyColors[question.difficulty] }}
                      >
                        {question.difficulty}
                      </span>
                      <span className={styles.frequencyTag}>
                        {question.frequency === "High" ? "⭐⭐⭐" : question.frequency === "Medium" ? "⭐⭐" : "⭐"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.questionActions}>
                    <button className={styles.actionButton}>
                      <span className={styles.actionIcon}>📝</span>
                      Practice
                    </button>
                    <button className={styles.actionButton}>
                      <span className={styles.actionIcon}>💾</span>
                      Save
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3 className={styles.noResultsTitle}>No questions found</h3>
                <p className={styles.noResultsText}>Try adjusting your search or filters to find more questions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
