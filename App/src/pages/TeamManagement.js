import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
import Papa from "papaparse";

const TeamManagement = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [students, setStudents] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [teamFormVisible, setTeamFormVisible] = useState(false);
  const [instructorEmail, setInstructorEmail] = useState(""); // State for storing instructor email

  useEffect(() => {
    // Fetch instructor's email on component mount
    const fetchInstructorData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching instructor data:", error.message);
        return;
      }
      setInstructorEmail(data?.user?.email || ""); // Set instructor's email
    };

    fetchInstructorData();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTeamManagement = () => {
    setTeamFormVisible(!teamFormVisible);
  };

  const handleStudentCountChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setStudentCount(count);
    setStudents(Array(count).fill(""));
  };

  const handleStudentNameChange = (index, value) => {
    const newStudents = [...students];
    newStudents[index] = value;
    setStudents(newStudents);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (teamName === "" || students.some((student) => student === "")) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([{ teamname: teamName }])
        .select("id")
        .single();

      if (teamError) throw teamError;

      const teamId = teamData.id;

      const { data: users, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .in("email", students);

      const teamMembers = users.map((user) => ({
        user_id: user.id,
        team_id: teamId,
      }));

      const { error: insertError } = await supabase
        .from("team_members")
        .insert(teamMembers);

      if (insertError) throw insertError;

      alert("Team and students added successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create team or add students.");
    }
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const csvData = results.data;
        if (!csvData.length) {
          alert("CSV file is empty or invalid.");
          return;
        }

        try {
          const filteredCsvData = csvData.filter(
            (row) => row.teamname && row.email
          );
          const teams = [
            ...new Set(filteredCsvData.map((row) => row.teamname)),
          ];

          for (const team of teams) {
            if (!team || team.trim() === "") {
              console.log("Skipping empty team name");
              continue;
            }

            const { data: teamData, error: teamError } = await supabase
              .from("teams")
              .insert([{ teamname: team }])
              .select("id")
              .single();

            if (teamError) throw teamError;

            const teamId = teamData.id;
            const teamStudents = filteredCsvData.filter(
              (row) => row.teamname === team
            );
            const emails = teamStudents
              .map((row) => row.email)
              .filter((email) => !!email);

            if (emails.length === 0) {
              console.log(`No valid emails found for team ${team}`);
              continue;
            }

            for (const email of emails) {
              if (!email || email.trim() === "") {
                console.log("Invalid email detected:", email);
                continue;
              }

              const { data: existingUser, error: fetchError } = await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .single();

              let userId;

              if (!existingUser) {
                const { data: newUser, error: userError } = await supabase
                  .from("users")
                  .insert([{ email, is_teacher: false }])
                  .select("id")
                  .single();

                if (userError) throw userError;
                userId = newUser.id;
              } else {
                userId = existingUser.id;
              }

              const { error: teamMemberError } = await supabase
                .from("team_members")
                .insert([{ user_id: userId, team_id: teamId }]);

              if (teamMemberError) throw teamMemberError;
            }
          }

          alert("Teams and students added successfully from CSV!");
          setCsvFile(null); // Reset the state holding the CSV file
          document.getElementById("csv-upload-input").value = ""; // Clear the actual file input in the DOM
        } catch (error) {
          console.error("Error:", error.message);
          alert("Failed to create teams or add students from CSV.");
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error.message);
        alert("Failed to parse CSV.");
      },
    });
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

      <div className="instructor-info">
        <p>
          Welcome, Instructor! Here you can manage teams, upload rosters, and
          view assessment results.
        </p>
        <p>
          <strong>Email:</strong> {instructorEmail}
        </p>
      </div>

      <div className="menu-container">
        <button className="menu-toggle-button" onClick={toggleMenu}>
          {menuVisible ? "Hide Menu" : "Menu"}
        </button>
        {menuVisible && (
          <nav className="menu-links">
            <button className="btn" onClick={toggleTeamManagement}>
              Team Management
            </button>
            <Link to="/assessment-results">
              <button className="btn">Assessment Results</button>
            </Link>
            <Link to="/analysis">
              <button className="btn">Analyse Results</button>
            </Link>
            <Link to="/handle-teams">
              <button className="btn">Show Teams</button>
            </Link>
            <Link to="/requests">
              <button className="btn">View Requests</button>
            </Link>
            <Link to="/contact-us">
              <button className="btn">Contact Us</button>
            </Link>
            <Link to="/Logout">
              <button className="btn">Logout</button>
            </Link>
            <Link to="/">
              <button className="btn">Welcome Page</button>
            </Link>
          </nav>
        )}
      </div>

      {teamFormVisible && (
        <div className="team-management-section">
          <h2 className="section-title">Team Management</h2>

          <div className="team-creation-form">
            <h3 className="form-title">Create a Team</h3>
            <div className="form-controls">
              <label htmlFor="student-count-select">Number of Students:</label>
              <select
                id="student-count-select"
                onChange={handleStudentCountChange}
                value={studentCount}
                className="student-count-select"
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <button
                className="btn generate-inputs"
                onClick={() => setStudents(Array(studentCount).fill(""))}
              >
                Generate Inputs
              </button>
            </div>

            {students.map((name, index) => (
              <div key={index} className="student-input">
                <input
                  type="text"
                  placeholder={`Student ${index + 1} Email`}
                  value={name}
                  onChange={(e) =>
                    handleStudentNameChange(index, e.target.value)
                  }
                  className="input-text"
                />
              </div>
            ))}

            <div className="team-name-input">
              <label>Team Name:</label>
              <input
                type="text"
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="input-text"
              />
            </div>

            <div className="submit-button-container">
              <button className="btn submit-team-button" onClick={handleSubmit}>
                Create Team
              </button>
            </div>
          </div>

          <div className="csv-upload-section">
            <h3 className="form-title">Upload CSV to Create Teams</h3>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="csv-upload-input"
              className="input-file"
            />
            <button className="btn upload-csv-button" onClick={handleCsvSubmit}>
              Upload CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
