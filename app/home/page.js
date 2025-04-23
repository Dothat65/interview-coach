'"use client";'
import Card from "../components/Card";
import styles from "./home.module.css"; // Import CSS for the home page
import Link from "next/link";
import { User } from "lucide-react"; // Importing User icon from lucide-react

export default function HomePage() {
  return (
    <div>
      <div className={styles.profileIcon}>
  <Link href="/profile">
    <User size={60} />
  </Link>
</div>
      <div className = {styles.home}>
        <h1 className = {styles.title}>Interview Coach</h1>
      </div>
    <div className={styles.hero}>
  <div className={styles.heroOverlay}>
  </div>
</div>

<div className={styles.cardContainer}>
        <Link href="/mock_interview" className={styles.cardLink}>
          <Card
            title="Mock Interviews"
            description="Practice your interview skills with real-world questions."
          />
        </Link>
        <Link href="/popularquestions" className={styles.cardLink}>
          <Card
            title="Popular Interview Questions"
            description="Explore a curated list of popular interview questions to prepare."
          />
        </Link>

        <Link href="/resources" className={styles.cardLink}>
          <Card
            title="Resources"
            description="Access a library of resources to prepare for interviews."
          />
        </Link>
      </div>
      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Interview Coach. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}