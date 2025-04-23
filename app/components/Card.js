"use client";
import styles from './Card.module.css'; // Import the CSS Module for styling

export default function Card({ title, description, link }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}

