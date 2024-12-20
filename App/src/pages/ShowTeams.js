import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const ShowTeams = () => {
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [requestTeamId, setRequestTeamId] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserTeamAndTeams = async () => {
      const userResponse = await supabase.auth.getUser();
      if (!userResponse || !userResponse.data) {
        console.error("Error fetching user: User data is undefined");
        return;
      }

      const { user } = userResponse.data;
      if (!user) {
        console.error("Error: User not found in userResponse");
        return;
      }

      const loggedInUserEmail = user.email;
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("email", loggedInUserEmail)
        .single();

      if (usersError || !usersData) {
        console.error(
          "Error fetching user id from users table:",
          usersError?.message
        );
        return;
      }

      const userId = usersData.id;
      const { data: userTeamData, error: userTeamError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", userId)
        .single();

      if (userTeamError) {
        console.error("Error fetching user's team:", userTeamError.message);
      } else if (userTeamData) {
        setUserTeam(userTeamData.team_id);
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`id, teamname, team_members(user_id, users(email))`)
        .order("id", { ascending: true });

      if (teamsError) {
        console.error("Error fetching teams:", teamsError.message);
      } else {
        setTeams(teamsData);
      }
    };

    fetchUserTeamAndTeams();
  }, []);

  const handleLeaveTeam = async () => {
    if (userTeam) {
      const { data: userData } = await supabase.auth.getUser();
      const loggedInUserEmail = userData?.user?.email;

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("email", loggedInUserEmail)
        .single();

      if (usersError || !usersData) {
        console.error(
          "Error fetching user id from users table:",
          usersError?.message
        );
        return;
      }

      const userId = usersData.id;
      const { error } = await supabase
        .from("team_members")
        .delete()
        .match({ user_id: userId, team_id: userTeam });
      if (error) {
        console.error("Error leaving team:", error.message);
      } else {
        setUserTeam(null);
        alert("You have left the team.");
      }
    }
  };

  const handleRequestToJoinTeam = async (teamId) => {
    if (requestMessage) {
      const { data: userData } = await supabase.auth.getUser();
      const loggedInUserEmail = userData?.user?.email;

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("email", loggedInUserEmail)
        .single();

      if (usersError || !usersData) {
        console.error(
          "Error fetching user id from users table:",
          usersError?.message
        );
        return;
      }

      const userId = usersData.id;
      const { error } = await supabase.from("requests").insert([
        {
          user_id: userId,
          current_team: userTeam,
          new_team: teamId,
          message: requestMessage,
          status: "pending",
        },
      ]);
      if (error) {
        console.error("Error sending request:", error.message);
      } else {
        alert("Request sent to the professor.");
        setRequestTeamId(null);
        setRequestMessage("");
      }
    } else {
      alert("Please enter a message explaining your request.");
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

      <div className="teamsContainer">
        <h2>All Teams</h2>
        {teams.length === 0 ? (
          <p>No teams found.</p>
        ) : (
          <div className="teamList">
            {teams.map((team) => (
              <div key={team.id} className="teamItem">
                <h3>{team.teamname}</h3>
                <p>Members:</p>
                <ul className="membersList">
                  {team.team_members.map((member) => (
                    <li key={member.user_id}>{member.users.email}</li>
                  ))}
                </ul>
                {userTeam === team.id ? (
                  <button
                    className="button leaveButton"
                    onClick={handleLeaveTeam}
                  >
                    Leave Team
                  </button>
                ) : (
                  <>
                    <button
                      className="button requestButton"
                      onClick={() => setRequestTeamId(team.id)}
                    >
                      Request to Join
                    </button>
                    {requestTeamId === team.id && (
                      <div className="requestMessageBox">
                        <textarea
                          placeholder="Explain why you want to join this team..."
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                        />
                        <button
                          className="button sendRequestButton"
                          onClick={() => handleRequestToJoinTeam(team.id)}
                        >
                          Send Request
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTeams;
