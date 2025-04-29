"use client";
import { use, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Signup.module.css";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // State for user's full name
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup

  const router = useRouter();
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/home", // Replace with your desired redirect URL
      },
    });
  
    if (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-In Failed: " + error.message);
    } else {
      console.log("Google Sign-In successful!");
    }
  };

  const handleEmailSignUp = async () => {
    // Check if email and password are provided
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    } 
  
    // Sign up the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    // Handle sign-up error
    if (error) {
      console.log("Email sign-up error:", error.message);
      alert("Sign-Up Failed: " + error.message);
      return; // Stop execution if sign-up failed
    } 
  
    console.log("Sign-up successful! Data:", data);
    alert("Sign-Up Successful!");
  
    // 1. Extract user ID from the sign-up response
    const userId = data.user.id;
  
    // 2. Insert a new row into the "user_profiles" table
    const { error: profileErr } = await supabase
      .from("user_profiles")  // Target the user_profiles table
      .insert([               // Insert the user's profile
        {
          user_id: userId,    // Link to auth.users.id
          full_name: name,    // Store the full name provided by the user
        },
      ]);
  
    // Handle error while inserting profile
    if (profileErr) {
      console.error("Error creating profile:", profileErr.message);
      alert("Failed to create user profile.");
      return;  // Stop execution if profile creation failed
    }
  
    // If everything is successful, proceed
    console.log("Profile created successfully!");

    //re-direct to home page after successful sign-up
    router.push("/home"); // Change this to the route you want to redirect to after sign-up
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
      // Redirect to home page after successful login
      router.push("/home"); // Change this to the route you want to redirect to after login
    }
  };

  const toggleAuthMode = () => {
    // Toggle between login and signup mode
    setIsLogin(!isLogin);
    setEmail(""); // Clear email input when toggling
    setPassword(""); // Clear password input when toggling
    setName(""); // Clear name input when toggling
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo}>🚀 Interview Coach</div>
        <div className={styles.separator}></div>
        
        <div className={styles.inputGroup}>
    {/* Conditionally render Name input inside the group */}
    {!isLogin && (
      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
    )}

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
  </div>        {isLogin ? (
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
              <span onClick = {toggleAuthMode} className={styles.link}>
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={toggleAuthMode} className={styles.link}>
                Log In
              </span>
            </p>
          )}
        </div>
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          Continue with Google 
        </button>

      </div>
      
    </div>
  );
}