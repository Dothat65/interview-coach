import styles from './mockInterview.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.questionHeader}>Question 1 of 5</h1>

      <p className={styles.prompt}>
        Tell me about a time you faced a difficult challenge at work and how you overcame it.
      </p>

      <textarea
        className={styles.input}
        placeholder="Enter your response..."
        // value={response}
        // onChange={(e) => setResponse(e.target.value)}
      />

      <button
        className={styles.submitButton}
        // onClick={handleSubmit}
        // disabled={loading}
      >
        {"Submit"}
      </button>
    </div>
  );
}
