import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaStar, FaClipboard, FaUpload } from "react-icons/fa";

const Welcomepage = () => {
  let navigate = useNavigate();
  return (
    <div className="container">
      <header className="header1">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2 className="project-title">
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

      <div className="homepage-content">
        {/* Introduction Section */}
        <section className="intro-section">
          <h2 className="section-title">Welcome to Sharky Peer Assessment</h2>
          <p className="intro-paragraph">
            Sharky is a peer assessment tool designed to make teamwork more
            effective and transparent. Whether you're a student or an
            instructor, Sharky provides an easy-to-use interface for managing
            and assessing team dynamics.
          </p>
        </section>

        {/* Key Features Section with Cards */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <ul className="features-list">
            <li>
              <FaUsers className="icon" />{" "}
              <span>Create teams with up to 10 members</span>
            </li>
            <li>
              <FaStar className="icon" />{" "}
              <span>Rate peers with a detailed 5-point scale</span>
            </li>
            <li>
              <FaClipboard className="icon" />{" "}
              <span>Anonymous peer assessments for fairness</span>
            </li>
            <li>
              <FaUpload className="icon" />{" "}
              <span>Instructors can upload CSV files to manage teams</span>
            </li>
          </ul>
        </section>

        {/* Instructor Section */}
        <section className="instructor-section">
          <h2 className="section-title">For Instructors</h2>
          <p className="instructor-paragraph">
            Manage teams, monitor dynamics, and streamline grading with Sharky’s
            comprehensive feedback and insights.
          </p>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <h2 className="section-title">Get Started Now!</h2>
          <p className="cta-paragraph">
            Ready to experience enhanced teamwork? Sign up today and make the
            most of Sharky’s peer assessment features.
          </p>
          <Link to="/signup" className="cta-btn">
            Sign Up
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Welcomepage;
