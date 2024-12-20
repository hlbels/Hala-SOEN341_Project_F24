import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PracticalAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const member = location.state?.member;
  //const team = location.state?.team;

  const initialData = {
    Assessorid: location.state?.Assessorid || "",
    Assessedmemberid: location.state?.Assessedmemberid || "",
    Team_id: location.state?.Team_id || " ",
  };

  // Form State for PRACTICAL CONTRIBUTION DIMENTSION
  const [formData, setFormData] = useState({
    ...initialData, //initialize with data passed from Assessment.js
    Practical1: "0",
    Practical2: "0",
    Practical3: "0",
    Practical4: "0",
    Practical5: "0",
    Practical6: "0",
    Practical7: "0",
    PracticalComment: " ",
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
      "Practical1",
      "Practical2",
      "Practical3",
      "Practical4",
      "Practical5",
      "Practical6",
      "Practical7",
      "PracticalComment",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        alert(`Field ${field} is required and is missing or undefined.`);
      }
    }

    try {
      const { data, error } = await supabase
        .from("PracticalContribution")
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
        PracticalComment: " ",
        Practical1: "0",
        Practical2: "0",
        Practical3: "0",
        Practical4: "0",
        Practical5: "0",
        Practical6: "0",
        Practical7: "0",
        Team_id: 0,
      });

      //Navigate to the next page with inherited data
      navigate("/WorkEthicAssessment", {
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
            ASSESSMENT DIMENSION 3: PRACTICAL CONTRIBUTION
          </h2>
          <h4 className="instruction-text">
            Please choose the number best describing the teammate (1 to 5):
          </h4>

          {/* Practical Contribution Questions */}
          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  1. How effectively did this team member contribute to the
                  project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical1"
                      value={value}
                      checked={formData.Practical1 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical1 ? "filled" : ""
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
                  2. How effectively did this team member troubleshoot any
                  issues or obstacles that arose during the project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical2"
                      value={value}
                      checked={formData.Practical2 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical2 ? "filled" : ""
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
                  3. Did this team member actively ensure that all project
                  components were consistent and aligned with the team's
                  objectives?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical3"
                      value={value}
                      checked={formData.Practical3 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical3 ? "filled" : ""
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
                  4. How well did this team member take initiative in gathering
                  or organizing resources beneficial to the team's practical
                  tasks?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical4"
                      value={value}
                      checked={formData.Practical4 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical4 ? "filled" : ""
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
                  5. How much effort did this team member put into refining the
                  project's final output to meet expected standards?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical5"
                      value={value}
                      checked={formData.Practical5 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical5 ? "filled" : ""
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
                  6. How often did this team member volunteer to take on
                  additional practical tasks to support the project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical6"
                      value={value}
                      checked={formData.Practical6 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical6 ? "filled" : ""
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
                  7. How supportive was this team member in assisting others
                  with practical tasks when they encountered difficulties?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Practical7"
                      value={value}
                      checked={formData.Practical7 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Practical7 ? "filled" : ""
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
          <label htmlFor="PracticalComment" className="form-label">
            <b>PRACTICAL CONTRIBUTION - Additional Feedback:</b>
          </label>
          <textarea
            id="PracticalComment"
            name="PracticalComment"
            rows="3"
            className="form-textarea"
            value={formData.PracticalComment}
            onChange={handleInputChange}
            placeholder="Write any comments concerning the Practical Contribution here..."
          />

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default PracticalAssessment;
