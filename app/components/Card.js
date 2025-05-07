// components/Card.js
"use client"; // Keep if you plan to add client-side interactions, otherwise not strictly needed for this version
import styles from './Card.module.css'; // Import the CSS Module for styling

// Update the component to accept and render the 'icon' prop
export default function Card({ icon, title, description }) {
  return (
    <div className={styles.card}>
      {/* Render the icon if it's provided */}
      {icon && <div className={styles.cardIconWrapper}>{icon}</div>}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      {/* You could add a "Learn More ->" text or similar here if desired */}
    </div>
  );
}
