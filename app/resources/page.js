// app/resources/page.js
import Link from 'next/link';
import styles from './resources.module.css';
import { BookOpen, ExternalLink, Lightbulb, Users, Youtube, FileText, Tool } from 'lucide-react'; // Added more icons

// Actual resources data
const resourceCategories = [
  {
    categoryTitle: "Resume & Cover Letter",
    icon: <FileText size={24} className={styles.categoryIcon} />,
    resources: [
      { title: "Harvard's Resume and Cover Letter Guide", link: "https://hwpi.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf", type: "PDF Guide", description: "Comprehensive tips from Harvard Extension School." },
      { title: "Zety - Cover Letter Examples", link: "https://zety.com/cover-letter-examples", type: "Examples", description: "Browse various cover letter samples for different roles." },
      { title: "Canva Resume Builder", link: "https://www.canva.com/create/resumes/", type: "Tool", description: "Design a professional-looking resume with online templates." },
      { title: "Kickresume - AI Resume & Cover Letter Writer", link: "https://www.kickresume.com/en/", type: "AI Tool", description: "AI-powered tools to help build your resume and cover letter." },
    ]
  },
  {
    categoryTitle: "Behavioral Questions",
    icon: <Users size={24} className={styles.categoryIcon} />,
    resources: [
      { title: "The STAR Method for Interview Questions", link: "https://www.themuse.com/advice/star-interview-method", type: "Guide", description: "Learn the STAR technique to structure your answers effectively." },
      { title: "Big Interview: Top Behavioral Questions", link: "https://biginterview.com/blog/behavioral-interview-questions", type: "Article", description: "Prepare for common behavioral questions with example answers." },
      { title: "Indeed: Behavioral Interview Questions and Answers", link: "https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions-and-answers", type: "Article", description: "More examples and tips for tackling behavioral questions." },
    ]
  },
  {
    categoryTitle: "Technical Skills & Coding Practice",
    icon: <Lightbulb size={24} className={styles.categoryIcon} />,
    resources: [
      { title: "LeetCode - Coding Interview Questions", link: "https://leetcode.com/", type: "Platform", description: "Practice coding problems frequently asked in tech interviews." },
      { title: "HackerRank - Skill Assessments & Practice", link: "https://www.hackerrank.com/", type: "Platform", description: "Test and improve your coding and problem-solving skills." },
      { title: "freeCodeCamp - Learn to Code for Free", link: "https://www.freecodecamp.org/learn/", type: "Learning", description: "Comprehensive curriculum for various tech stacks and concepts." },
      { title: "Exercism - Code Practice and Mentorship", link: "https://exercism.org/", type: "Platform", description: "Solve coding challenges in 60+ languages with community feedback." },
    ]
  },
  {
    categoryTitle: "Video Interview Tips",
    icon: <Youtube size={24} className={styles.categoryIcon} />,
    resources: [
      { title: "LinkedIn: Tips for Acing Your Video Interview", link: "https://www.linkedin.com/business/talent/blog/talent-acquisition/video-interview-tips", type: "Article", description: "Learn how to present yourself best in a virtual setting." },
      { title: "Indeed: Video Interview Guide", link: "https://www.indeed.com/career-advice/interviewing/video-interview-guide", type: "Guide", description: "Comprehensive guide to preparing for and succeeding in video interviews." },
      { title: "YouTube: Search 'Video Interview Tips'", link: "https://www.youtube.com/results?search_query=video+interview+tips", type: "Videos", description: "Explore various video guides and tips from career coaches." },
    ]
  },
  {
    categoryTitle: "General Interview Preparation",
    icon: <BookOpen size={24} className={styles.categoryIcon} />,
    resources: [
      { title: "The Muse: Interview Preparation Guide", link: "https://www.themuse.com/advice/interview-preparation-guide", type: "Guide", description: "A checklist and guide for overall interview prep." },
      { title: "Glassdoor: Interview Questions & Reviews", link: "https://www.glassdoor.com/Interview/index.htm", type: "Platform", description: "Company-specific interview questions and experiences shared by candidates." },
      { title: "Big Interview: Mock Interview Practice Tool", link: "https://biginterview.com/mock-interview-practice-module/", type: "Tool", description: "Practice mock interviews with AI and get feedback (some features may require payment)." },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          &larr; Back to Home
        </Link>
        <h1 className={styles.pageTitle}>Interview Preparation Resources</h1>
        <p className={styles.pageSubtitle}>
          Equip yourself with the best tools and knowledge to ace your next interview.
        </p>
      </header>

      <main className={styles.mainContent}>
        {resourceCategories.map((category, catIndex) => (
          <section key={catIndex} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>
              {category.icon}
              {category.categoryTitle}
            </h2>
            <div className={styles.resourceGrid}>
              {category.resources.map((resource, resIndex) => (
                <a
                  key={resIndex}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resourceCard}
                  title={`Go to ${resource.title}`}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.resourceTitle}>{resource.title}</h3>
                    <span className={styles.resourceType}>{resource.type}</span>
                  </div>
                  <p className={styles.resourceDescription}>{resource.description}</p>
                  <div className={styles.cardFooter}>
                    <span>View Resource</span>
                    <ExternalLink size={16} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Interview Coach. Keep Learning!</p>
      </footer>
    </div>
  );
}
