import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa"; // LinkedIn icon from react-icons

const ContactUs = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with your Google Apps Script URL
    const response = await fetch(
      "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      alert("Message sent! Thank you.");
    } else {
      alert("Error sending message. Please try again.");
    }
  };

  return (
    <div className="container contact-container">
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

      <div className="contact-content">
        <h2 className="section-title">Contact Me</h2>
        <p className="contact-paragraph">
          Created by Hala Belamri. Feel free to connect with me on LinkedIn or
          send me a message!
        </p>

        {/* "Connect with Me" Button */}
        <div className="linkedin-button-container">
          <a
            href="https://www.linkedin.com/in/hala-belamri/"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-button"
          >
            <FaLinkedin size={24} color="#fff" />
            <span>Connect with Me</span>
          </a>
        </div>
        <br />

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="input-text"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="input-text"
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="input-text"
              rows="5"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
