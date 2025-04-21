import Card from "../components/Card";
import styles from "./Home.module.css"; // Import CSS for the home page

export default function HomePage() {
  return (
    <div className={styles.cardContainer}>
      <Card
        title="Mock Interviews"
        description="Practice your interview skills with real-world questions."
        link="/mock-interviews"
      />
      <Card
        title="Popular Interview Questions"
        description="Explore a curated list of popular interview questions to prepare."
      />
      <Card
        title="Resources"
        description="Access a library of resources to prepare for interviews."
        link="/resources"
      />
    </div>
  );
}