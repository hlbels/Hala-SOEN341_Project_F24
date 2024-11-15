import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const ForgotPw = () => {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });
      if (error) throw error;

      alert("Check your email for the reset password link.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <header className="header1">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2>
          PInsights <br /> Peer Assessment
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

      <div className="login-box">
        <h2>Forgot Password</h2>
        <form
          id="forgot-password-form"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <div className="user-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-text"
              placeholder="Email"
            />
          </div>

          <div className="button-container">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPw;
