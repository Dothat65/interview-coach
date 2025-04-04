"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Signup.module.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Google Sign-In Error:", error.message);
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("Email sign-up error:", error.message);
      alert("Sign-Up Failed: " + error.message);
    } else {
      console.log("Sign-up successful! Data:", data);
      alert("Sign-Up Successful! Please check your email for confirmation.");
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
      alert("Login Successful!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo}>🚀 Interview Coach</div>
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          Continue with Google
        </button>
        <div className={styles.separator}>or</div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
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
              <span onClick={() => setIsLogin(false)} className={styles.link}>
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)} className={styles.link}>
                Log In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}