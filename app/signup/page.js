// app/signup/page.js (or wherever your AuthPage is located)
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; // Ensure this path is correct
import styles from "./Signup.module.css";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react"; // For success icon

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // --- New state for custom success message ---
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // --- End of new state ---

  const router = useRouter();

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) {
      setPasswordFeedback("");
      setPasswordStrength(0);
      return;
    }
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
    if (score < 3) {
      setPasswordFeedback("Weak");
    } else if (score < 5) {
      setPasswordFeedback("Medium");
    } else {
      setPasswordFeedback("Strong");
    }
  };

  useEffect(() => {
    if (!isLogin) {
      checkPasswordStrength(password);
    } else {
      setPasswordFeedback("");
      setPasswordStrength(0);
    }
  }, [password, isLogin]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-In Failed: " + error.message);
    } else {
      console.log("Google Sign-In initiated!");
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (passwordStrength < 2 && !isLogin) {
      alert("Password is too weak. Please choose a stronger password.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("Email sign-up error:", error.message);
      alert("Sign-Up Failed: " + error.message);
      return;
    }

    console.log("Sign-up successful! User data:", data.user);

    if (data.user) {
        const userId = data.user.id;
        const { error: profileErr } = await supabase
        .from("user_profiles")
        .insert([{ user_id: userId, full_name: name }]);

        if (profileErr) {
            console.error("Error creating profile:", profileErr.message);
            // Show success for signup, but mention profile issue
            setShowSuccessMessage(true);
            // Still proceed to redirect after showing message
            setTimeout(() => {
                setShowSuccessMessage(false);
                router.push("/"); // Redirect to home page
            }, 3000); // Show message for 3 seconds
        } else {
            console.log("Profile created successfully!");
            setShowSuccessMessage(true);
            // Redirect after showing the message for a few seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
                router.push("/"); // Redirect to home page
            }, 3000); // Show message for 3 seconds
        }
    } else {
        alert("Sign-Up processed, but there was an issue retrieving user details. Please try logging in.");
        setIsLogin(true);
    }
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login Error:", error.message);
      alert("Login Failed: " + error.message);
    } else {
      console.log("Login Successful! Data:", data);
      router.push("/");
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setPasswordFeedback("");
    setPasswordStrength(0);
    setShowSuccessMessage(false); // Hide success message if toggling
  };

  const getStrengthClass = () => {
    if (isLogin || !passwordFeedback) return '';
    switch (passwordFeedback) {
      case "Weak":
        return styles.strengthWeak;
      case "Medium":
        return styles.strengthMedium;
      case "Strong":
        return styles.strengthStrong;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/* --- Custom Success Message --- */}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <CheckCircle size={24} className={styles.successIcon} />
            <p>Sign-up successful! Redirecting you now...</p>
          </div>
        )}
        {/* --- End of Custom Success Message --- */}

        {!showSuccessMessage && ( // Hide form if success message is shown
          <>
            <div className={styles.logo}>🚀 Interview Coach</div>
            <div className={styles.separator}></div>
            <div className={styles.inputGroup}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  aria-label="Full Name"
                />
              )}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                aria-label="Email Address"
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.input}
                aria-label="Password"
              />
              {!isLogin && password && passwordFeedback && (
                <div className={`${styles.passwordStrengthIndicator} ${getStrengthClass()}`}>
                  Strength: {passwordFeedback}
                </div>
              )}
            </div>
            {isLogin ? (
              <button className={styles.authButton} onClick={handleLogIn}>
                Log In
              </button>
            ) : (
              <button className={styles.authButton} onClick={handleEmailSignUp}>
                Sign Up
              </button>
            )}
            <div className={styles.toggle}>
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <span onClick={toggleAuthMode} className={styles.link} role="button" tabIndex={0}>
                    Sign Up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span onClick={toggleAuthMode} className={styles.link} role="button" tabIndex={0}>
                    Log In
                  </span>
                </p>
              )}
            </div>
            <button className={styles.googleButton} onClick={handleGoogleSignIn}>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
