// app/home/page.js
import { createClient } from '@/lib/utils/supabase/server'
import Link from 'next/link'; 
import Image from 'next/image';
import Card from '../components/Card'; // Assuming Card component exists here
import styles from './home.module.css';
import { User, LogIn, ArrowRight, Briefcase, BarChart3, BookOpen as BookIcon } from 'lucide-react';

export default async function HomePage() {
  const supabase = createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  if (user) {
    console.log('HomePage: User session found.');
  } else {
    console.log('HomePage: No user session found.');
  }

  return (
    <div className={styles.pageWrapper}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogoLink}>
          <Image
            src="/images/logo.png" // Path relative to the 'public' folder
            alt="Interview Coach Logo"
            width={200} // Adjusted width
            height={47} // Adjusted height (maintaining aspect ratio)
            priority // Add priority if it's an LCP element
          />
        </Link>
        <div className={styles.navActions}>
          {user ? (
            <Link href="/profile" title="Go to Profile" className={styles.navLink}>
              <User size={40} /> <span>Profile</span>
            </Link>
          ) : (
            <Link href="/signup" title="Login / Signup" className={styles.navLink}>
              <LogIn size={20} /> <span>Login / Signup</span>
            </Link>
          )}
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Ace Your Next Interview, Guaranteed.
          </h1>
          <p className={styles.heroSubtitle}>
            Personalized AI coaching, realistic mock interviews, and expert resources designed to land your dream job.
          </p>
          <Link href={user ? "/mockInterviewSelection" : "/signup"} className={styles.ctaButton}>
            {user ? "Start Mock Interview" : "Get Started"}
            <ArrowRight size={22} style={{ marginLeft: '10px' }} />
          </Link>
        </div>
      </header>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Interview Coach?</h2>
        <div className={styles.cardContainer}>
          {/* Wrap Card with Link and remove redundant 'link' prop from Card itself */}
          <Link href={user ? "/mockInterviewSelection" : "/signup"} className={styles.cardLink}>
            <Card
              icon={<Briefcase size={32} className={styles.cardIcon} />}
              title="Realistic Mock Interviews"
              description="Practice with AI-generated questions tailored to your target roles and get instant feedback."
            />
          </Link>

          <Link href="/popularquestions" className={styles.cardLink}>
            <Card
              icon={<BarChart3 size={32} className={styles.cardIcon} />}
              title="Popular Questions Library"
              description="Explore a vast database of common and challenging interview questions across industries."
            />
          </Link>

          <Link href="/resources" className={styles.cardLink}>
            <Card
              icon={<BookIcon size={32} className={styles.cardIcon} />}
              title="Curated Learning Resources"
              description="Access expert articles, guides, and tips to master every aspect of the interview process."
            />
          </Link>
        </div>
      </section>

      {/* You can add more sections here: Testimonials, How it Works, etc. */}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Interview Coach. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
