import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token to log out
    // Force a quick redirect to home page after logout
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // Check if the user is logged in when this page is loaded
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, already logged out, redirect to home page (or login page if needed)
      navigate("/logout", { replace: true });
    }
  }, [navigate]);

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

      <div className="Logout-box">
        <h1>Logout</h1>
        <p>You have been logged out. Thank you for using our application!</p>
        <button onClick={handleLogout}>Go to Home Page</button>
      </div>
    </div>
  );
};

export default Logout;
