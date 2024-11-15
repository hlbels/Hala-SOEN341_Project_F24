import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const WorkEthicAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const member = location.state?.member;
  //const team = location.state?.team;

  const initialData = {
    Assessorid: location.state?.Assessorid || "",
    Assessedmemberid: location.state?.Assessedmemberid || "",
    Team_id: location.state?.Team_id || " ",
  };

  // Form State for Work Ethic DIMENTSION
  const [formData, setFormData] = useState({
    ...initialData, //initialize with data passed from Assessment.js
    Work1: "0",
    Work2: "0",
    Work3: "0",
    Work4: "0",
    Work5: "0",
    Work6: "0",
    Work7: "0",
    WorkComment: " ",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (if needed, you can implement submit logic)
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    //Validate that required field are set
    const requiredFields = [
      "Assessorid",
      "Assessedmemberid",
      "Team_id",
      "Work1",
      "Work2",
      "Work3",
      "Work4",
      "Work5",
      "Work6",
      "Work7",
      "WorkComment",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        alert(`Field ${field} is required and is missing or undefined.`);
      }
    }

    try {
      const { data, error } = await supabase
        .from("WorkEthic")
        .insert([formData]);
      if (error) {
        console.error("Supabase error details: ", error);
        throw error;
      }

      console.log("Form Submitted:", formData);
      alert("Assessment submitted successfully!");

      // Reset form data after submission
      setFormData({
        Assessorid: 0,
        Assessedmemberid: 0,
        WorkComment: " ",
        Work1: "0",
        Work2: "0",
        Work3: "0",
        Work4: "0",
        Work5: "0",
        Work6: "0",
        Work7: "0",
        Team_id: 0,
      });

      //Navigate to the next page
      navigate("/Confirmpage", {
        state: {
          Assessorid: formData.Assessorid,
          Assessedmemberid: formData.Assessedmemberid,
          Team_id: formData.Team_id,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting the assessment. Please try again."); // Provide user feedback
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
          <button className="btn" onClick={() => navigate("/homepage")}>
            Homepage
          </button>
          <button className="btn" onClick={() => navigate("/show-teams")}>
            Teams
          </button>
          <button className="btn" onClick={() => navigate("/Assessment")}>
            Assessment
          </button>
          <button className="btn" onClick={() => navigate("/contact-us")}>
            Contact Us
          </button>
          <button className="btn" onClick={() => navigate("/logout")}>
            Logout
          </button>
        </div>
      </nav>

      <div className="assessment-form-container">
        <h3 className="assessment-title">
          <i>Evaluation Form</i>
        </h3>
        <form onSubmit={handleSubmit} className="assessment-form">
          <h2 className="assessment-dimension-title">
            ASSESSMENT DIMENSION 4: WORK ETHIC
          </h2>
          <h4 className="instruction-text">
            Please choose the number best describing the teammate (1 to 5):
          </h4>

          {/* Work Ethic Questions */}
          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  1. How reliable was this team member in fulfilling their
                  responsibilities and commitments to the team?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work1"
                      value={value}
                      checked={formData.Work1 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work1 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  2. How well did this team member manage their time and
                  prioritize tasks to meet project deadlines?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work2"
                      value={value}
                      checked={formData.Work2 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work2 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  3. How effectively did this team member handle constructive
                  criticism and feedback from the team?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work3"
                      value={value}
                      checked={formData.Work3 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work3 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  4. How well did this team member demonstrate accountability
                  for their work, taking responsibility for mistakes and
                  learning from them?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work4"
                      value={value}
                      checked={formData.Work4 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work4 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  5. How positive and proactive was this team member's attitude
                  towards challenges and setbacks?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work5"
                      value={value}
                      checked={formData.Work5 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work5 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  6. How well did this team member balance their workload to
                  avoid impacting the team negatively during critical phases?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work6"
                      value={value}
                      checked={formData.Work6 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work6 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  7. How well was this team member prepared for team meetings
                  and group work sessions?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Work7"
                      value={value}
                      checked={formData.Work7 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Work7 ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Feedback Section */}
          <label htmlFor="WorkComment" className="form-label">
            <b>Work Ethic - Additional Feedback:</b>
          </label>
          <textarea
            id="WorkComment"
            name="WorkComment"
            rows="3"
            className="form-textarea"
            value={formData.WorkComment}
            onChange={handleInputChange}
            placeholder="Write any comments concerning the work ethic here..."
          />

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkEthicAssessment;
