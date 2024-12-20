import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ConceptualAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const member = location.state?.member;
  //const team = location.state?.team;

  const initialData = {
    Assessorid: location.state?.Assessorid || "",
    Assessedmemberid: location.state?.Assessedmemberid || "",
    Team_id: location.state?.Team_id || " ",
  };

  // Form State for CONCEPTUAL CONTRIBUTION DIMENTSION
  const [formData, setFormData] = useState({
    ...initialData, //initialize with data passed from Assessment.js
    Conceptual1: "0",
    Conceptual2: "0",
    Conceptual3: "0",
    Conceptual4: "0",
    Conceptual5: "0",
    Conceptual6: "0",
    Conceptual7: "0",
    ConceptualComment: " ",
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
      "Conceptual1",
      "Conceptual2",
      "Conceptual3",
      "Conceptual4",
      "Conceptual5",
      "Conceptual6",
      "Conceptual7",
      "ConceptualComment",
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        alert(`Field ${field} is required and is missing or undefined.`);
      }
    }

    try {
      const { data, error } = await supabase
        .from("ConceptualContribution")
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
        ConceptualComment: " ",
        Conceptual1: "0",
        Conceptual2: "0",
        Conceptual3: "0",
        Conceptual4: "0",
        Conceptual5: "0",
        Conceptual6: "0",
        Conceptual7: "0",
        Team_id: 0,
      });

      //Navigate to the next page with inherited data
      navigate("/PracticalAssessment", {
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
            ASSESSMENT DIMENSION 2: CONCEPTUAL CONTRIBUTION
          </h2>
          <h4 className="instruction-text">
            Please choose the number best describing the teammate (1 to 5):
          </h4>

          {/* Conceptual Contribution Questions */}
          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  1. Did this team member contribute to researching and
                  gathering relevant information?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual1"
                      value={value}
                      checked={formData.Conceptual1 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual1 ? "filled" : ""
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
                  2. How would you rate the quality of this team member's
                  contribution to the project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual2"
                      value={value}
                      checked={formData.Conceptual2 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual2 ? "filled" : ""
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
                  3. How frequently did the team member suggest ideas that added
                  value to the project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual3"
                      value={value}
                      checked={formData.Conceptual3 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual3 ? "filled" : ""
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
                  4. How well did the team member integrate various ideas within
                  the team?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual4"
                      value={value}
                      checked={formData.Conceptual4 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual4 ? "filled" : ""
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
                  5. How proactive was this team member in identifying potential
                  challenges and difficulties?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual5"
                      value={value}
                      checked={formData.Conceptual5 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual5 ? "filled" : ""
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
                  6. How effective was this team member in identifying and
                  integrating solutions to advance the project?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual6"
                      value={value}
                      checked={formData.Conceptual6 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual6 ? "filled" : ""
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
                  7. Overall, did this team member's conceptual contribution
                  help guide the team in the right direction?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conceptual7"
                      value={value}
                      checked={formData.Conceptual7 === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conceptual7 ? "filled" : ""
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
          <label htmlFor="ConceptualComment" className="form-label">
            <b>CONCEPTUAL CONTRIBUTION - Additional Feedback:</b>
          </label>
          <textarea
            id="ConceptualComment"
            name="ConceptualComment"
            rows="3"
            className="form-textarea"
            value={formData.ConceptualComment}
            onChange={handleInputChange}
            placeholder="Write any comments concerning the Conceptual Contribution here..."
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

export default ConceptualAssessment;
