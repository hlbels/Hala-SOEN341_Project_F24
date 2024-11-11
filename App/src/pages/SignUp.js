import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const SignUp = () => {
  let navigate = useNavigate();

  const [formData, setFormdata] = useState({
    email: "",
    userName: "",
    password: "",
    role: "student",
  });

  function handleChange(event) {
    setFormdata((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Sign up the user and set role in user_metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            userName: formData.userName,
            role: formData.role, // Adding role in authentication table
          },
        },
      });

      if (error) throw error;

      alert("Check your email for Verification link");

      // Insert role into the 'users' table with is_teacher boolean
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            email: formData.email,
            is_teacher: formData.role === "teacher", // Set boolean based on role
          },
        ]);

      if (insertError) throw insertError;

      // Navigate to login after successful signup
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="container">
      {/* Add the Sharky Peer Assessment title at the top */}
      <header className="header1">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2>
          Sharky <br /> Peer Assessment
        </h2>
      </header>

      {/* Sidebar for Login, Sign Up, Contact Us, and Welcome Page */}
      <nav className="sidebar">
        <div className="menu-buttons">
          <button className="btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className="btn" onClick={() => navigate("/contact-us")}>
            Contact Us
          </button>
          <button className="btn" onClick={() => navigate("/")}>
            About Sharky
          </button>
        </div>
      </nav>

      <div className="signup-box" id="signup-box">
        <h2>Create Account</h2>
        <form
          id="signupform"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <div className="user-box">
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Email"
            />
          </div>
          <div className="user-box">
            <input
              type="text"
              id="new-username"
              name="userName"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Username"
            />
          </div>
          <div className="user-box">
            <input
              type="password"
              id="new-password"
              name="password"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Password"
            />
          </div>

          <div className="user-box">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-text"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="button-container">
            <button type="submit" className="btn">
              Sign Up
            </button>
          </div>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
