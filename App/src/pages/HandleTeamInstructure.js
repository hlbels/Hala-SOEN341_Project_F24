import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const HandleTeams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null); // Track which option is selected
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsAndMembers = async () => {
      try {
        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*");
        if (teamsError) throw teamsError;

        const teamsWithMembers = await Promise.all(
          teamsData.map(async (team) => {
            const { data: teamMembersData, error: teamMembersError } =
              await supabase
                .from("team_members")
                .select("user_id")
                .eq("team_id", team.id);

            if (teamMembersError) throw teamMembersError;

            const userIds = teamMembersData.map((tm) => tm.user_id);
            const { data: usersData, error: usersError } = await supabase
              .from("users")
              .select("id, email")
              .in("id", userIds);

            if (usersError) throw usersError;

            return {
              ...team,
              members: usersData,
            };
          })
        );

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, email, is_teacher")
          .eq("is_teacher", false);

        if (usersError) throw usersError;

        setTeams(teamsWithMembers);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams and members:", error.message);
        setLoading(false);
      }
    };

    fetchTeamsAndMembers();
  }, []);

  const handleRemoveMember = async (teamId, userId) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .match({ team_id: teamId, user_id: userId });
      if (error) throw error;
      alert("Member removed from team.");
      window.location.reload();
    } catch (error) {
      console.error("Error removing member:", error.message);
    }
  };

  const handleAddMemberToTeam = async (teamId) => {
    if (!selectedUser) {
      alert("Please select a user to add to the team.");
      return;
    }

    try {
      const { error } = await supabase
        .from("team_members")
        .insert([{ user_id: selectedUser.id, team_id: teamId }]);
      if (error) throw error;
      alert("Member added to the team.");
      window.location.reload();
    } catch (error) {
      console.error("Error adding member to team:", error.message);
    }
  };

  const handleChangeTeam = async (newTeamId, userId) => {
    try {
      await supabase.from("team_members").delete().match({ user_id: userId });
      await supabase
        .from("team_members")
        .insert([{ user_id: userId, team_id: newTeamId }]);
      alert("Team updated successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error changing team:", error.message);
    }
  };

  const toggleOption = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  if (loading) {
    return <p>Loading teams...</p>;
  }

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
          <button className="btn" onClick={() => navigate("/team-management")}>
            Team Management
          </button>
          <button className="btn" onClick={() => navigate("/handle-teams")}>
            Show teams
          </button>
          <button
            className="btn"
            onClick={() => navigate("/assessment-results")}
          >
            Assessment Results
          </button>
          <button className="btn" onClick={() => navigate("/analysis")}>
            Analyze Results
          </button>
          <button className="btn" onClick={() => navigate("/requests")}>
            View Requests
          </button>
          <button className="btn" onClick={() => navigate("/")}>
            Logout
          </button>
          <button className="btn" onClick={() => navigate("/contact-us")}>
            Contact Us
          </button>
        </div>
      </nav>

      <div className="options-container">
        <h2 className="options-title">Team Management Options</h2>
        <div className="options-buttons">
          <button
            className="option-button"
            onClick={() => toggleOption("displayTeams")}
          >
            Display Teams
          </button>
          <button
            className="option-button"
            onClick={() => toggleOption("modifyTeams")}
          >
            Modify Teams
          </button>
          <button
            className="option-button"
            onClick={() => toggleOption("addMember")}
          >
            Add Member to Teams
          </button>
        </div>

        {/* Display Teams */}
        {selectedOption === "displayTeams" && (
          <div className="teams-display">
            <h3 className="section-title">Teams</h3>
            {teams.length === 0 ? (
              <p className="no-teams-message">No teams found.</p>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="team-card">
                  <h4 className="team-name">{team.teamname}</h4>
                  <p className="members-title">Members:</p>
                  <ul className="members-list">
                    {team.members.length === 0 ? (
                      <li className="no-members-message">No members found.</li>
                    ) : (
                      team.members.map((member) => (
                        <li key={member.id} className="member-item">
                          {member.email}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modify Teams */}
        {selectedOption === "modifyTeams" && (
          <div className="modify-teams">
            <h3 className="section-title">Modify Teams</h3>
            {teams.length === 0 ? (
              <p className="no-teams-message">No teams found.</p>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="team-card">
                  <h4 className="team-name">{team.teamname}</h4>
                  <ul className="members-list">
                    {team.members.length === 0 ? (
                      <li className="no-members-message">No members found.</li>
                    ) : (
                      team.members.map((member) => (
                        <li key={member.id} className="member-item">
                          {member.email}
                          <button
                            className="remove-button"
                            onClick={() =>
                              handleRemoveMember(team.id, member.id)
                            }
                          >
                            Remove
                          </button>
                          <select
                            className="team-select"
                            onChange={(e) =>
                              handleChangeTeam(e.target.value, member.id)
                            }
                          >
                            <option value="">Change Team</option>
                            {teams
                              .filter((t) => t.id !== team.id)
                              .map((otherTeam) => (
                                <option key={otherTeam.id} value={otherTeam.id}>
                                  {otherTeam.teamname}
                                </option>
                              ))}
                          </select>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Members */}
        {selectedOption === "addMember" && (
          <div className="add-member-section">
            <h3 className="section-title">Add User to Team</h3>
            {teams.map((team) => (
              <div key={team.id} className="team-card">
                <h4 className="team-name">{team.teamname}</h4>
                <select
                  className="user-select"
                  onChange={(e) =>
                    setSelectedUser(
                      users.find((user) => user.id === parseInt(e.target.value))
                    )
                  }
                >
                  <option value="">Select a user</option>
                  {users
                    .filter(
                      (user) => !team.members.some((m) => m.id === user.id)
                    )
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                </select>
                <button
                  className="add-member-button"
                  onClick={() => handleAddMemberToTeam(team.id)}
                >
                  Add Member
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleTeams;
