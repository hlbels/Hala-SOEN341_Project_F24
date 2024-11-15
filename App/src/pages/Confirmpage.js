import React from "react";
import { useNavigate } from "react-router-dom";

const Confirmpage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Adjust this key based on your implementation
    // Navigate to the home page
    navigate("/");
  };

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

      <h1>Thank you for filling out the form</h1>

      <button onClick={handleLogout}>Go to Home Page</button>
    </div>
  );
};

export default Confirmpage;
