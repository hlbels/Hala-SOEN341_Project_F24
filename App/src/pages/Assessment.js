import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Assessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;
  const team = location.state?.team;

  const [formData, setFormData] = useState({
    Assessorid: "",
    Assessedmemberid: member,
    Team_id: team,
    Communication: "",
    Participation: "",
    Assistance: "",
    Respect: "",
    Cooperation: "",
    Conflict_Resolution: "",
    AdaptibilityandFlexibility: "",
    Commentsection: "",
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    const fetchUserAndTeam = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const userEmail = user.email;

        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", userEmail)
          .single();
        const userId = userData.id;

        const { data: teamMemberData } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", userId)
          .single();
        const userTeamId = teamMemberData.team_id;

        const { data: membersData, error } = await supabase
          .from("team_members")
          .select("user_id, users(email)")
          .eq("team_id", userTeamId);

        if (error) {
          console.error("Error fetching team members:", error.message);
        } else {
          setTeamMembers(
            membersData.map((member) => ({
              email: member.users.email,
              user_id: member.user_id,
            }))
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            Assessorid: userId,
            Team_id: userTeamId,
          }));
        }
      }
    };
    fetchUserAndTeam();
  }, []);

  const handleMemberSelection = (event) => {
    const selectedMemberEmail = event.target.value;
    const selectedMember = teamMembers.find(
      (member) => member.email === selectedMemberEmail
    );

    if (selectedMember) {
      setSelectedMember(selectedMemberEmail);
      setFormData((prevFormData) => ({
        ...prevFormData,
        Assessedmemberid: selectedMember.user_id,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Peer Assessment Questions")
        .insert([formData]);
      if (error) throw error;

      alert("Assessment submitted successfully!");
      navigate("/ConceptualAssessment", {
        state: {
          Assessorid: formData.Assessorid,
          Assessedmemberid: formData.Assessedmemberid,
          Team_id: formData.Team_id,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting the assessment. Please try again.");
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
        <h3 className="assessment-title">Evaluation Form</h3>
        <form onSubmit={handleSubmit} className="assessment-form">
          <label htmlFor="Assessorid" className="form-label">
            Your ID:
          </label>
          <input
            type="text"
            id="Assessorid"
            name="Assessorid"
            value={formData.Assessorid}
            onChange={handleInputChange}
            required
            className="form-input"
          />

          <h3 className="member-select-title">Select Team Member</h3>
          <select
            value={selectedMember}
            onChange={handleMemberSelection}
            className="member-select"
          >
            <option value="">Select a team member</option>
            {teamMembers.map((member) => (
              <option key={member.user_id} value={member.email}>
                {member.email}
              </option>
            ))}
          </select>

          <h2 className="assessment-dimension-title">
            ASSESSMENT DIMENSION: COOPERATION
          </h2>

          <div className="form-group">
            <div className="rating-group">
              <label className="rating-label">
                <b>
                  1. Did this team member communicate effectively with the rest
                  of the group?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Communication"
                      value={value}
                      checked={formData.Communication === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Communication ? "filled" : ""
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
                  2. Did this team member actively participate in group
                  discussions?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Participation"
                      value={value}
                      checked={formData.Participation === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Participation ? "filled" : ""
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
                  3. Was this team member willing to assist others when needed?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Assistance"
                      value={value}
                      checked={formData.Assistance === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Assistance ? "filled" : ""
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
                  4. Did this team member respect and consider the ideas and
                  perspectives of others?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Respect"
                      value={value}
                      checked={formData.Respect === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Respect ? "filled" : ""
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
                  5. How well did this team member adapt to changes in the
                  project or team dynamics?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="AdaptibilityandFlexibility"
                      value={value}
                      checked={
                        formData.AdaptibilityandFlexibility === String(value)
                      }
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.AdaptibilityandFlexibility
                          ? "filled"
                          : ""
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
                  6. Did they collaborate to find solutions rather than escalate
                  issues?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Conflict_Resolution"
                      value={value}
                      checked={formData.Conflict_Resolution === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Conflict_Resolution ? "filled" : ""
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
                  7. Did this team member collaborate effectively and contribute
                  to a positive team environment?
                </b>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="Cooperation"
                      value={value}
                      checked={formData.Cooperation === String(value)}
                      onChange={handleInputChange}
                      className="rating-input"
                      required
                    />
                    <span
                      className={`star ${
                        value <= formData.Cooperation ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <label htmlFor="Commentsection" className="form-label">
            COOPERATION - Additional Feedback:
          </label>
          <textarea
            id="Commentsection"
            name="Commentsection"
            rows="3"
            className="form-textarea"
            value={formData.Commentsection}
            onChange={handleInputChange}
            placeholder="Write any comments here..."
          />

          <button type="submit" className="submit-button">
            NEXT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assessment;
