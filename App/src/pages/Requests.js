import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestsAndTeams = async () => {
      try {
        // Fetch all teams to map team IDs to team names
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("id, teamname");

        if (teamsError) throw teamsError;

        const teamMap = teamsData.reduce((map, team) => {
          map[team.id] = team.teamname;
          return map;
        }, {});
        setTeams(teamMap);

        // Fetch requests with team and user data
        const { data: requestsData, error: requestsError } = await supabase
          .from("requests")
          .select(
            "id, user_id, current_team, new_team, message, status, users(email)"
          )
          .eq("status", "pending")
          .order("id", { ascending: true });

        if (requestsError) throw requestsError;
        setRequests(requestsData);
      } catch (error) {
        console.error("Error fetching requests or teams:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsAndTeams();
  }, []);

  const handleApprove = async (requestId, userId, newTeamId) => {
    try {
      const { error: updateError } = await supabase
        .from("requests")
        .update({ status: "approved" })
        .eq("id", requestId);

      if (updateError) throw updateError;

      await supabase.from("team_members").delete().eq("user_id", userId);
      const { error: insertError } = await supabase
        .from("team_members")
        .insert([{ user_id: userId, team_id: newTeamId }]);

      if (insertError) throw insertError;

      alert("Request approved and student moved to new team.");
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Error approving request:", error.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;
      alert("Request rejected.");
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error.message);
    }
  };

  if (loading) return <p className="loading-message">Loading requests...</p>;

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

      <header className="header2">
        <h2>Student Join Requests</h2>
      </header>

      <div className="requestsSection">
        {requests.length === 0 ? (
          <p className="noRequestsMessage">No pending requests.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="requestCard">
              <p className="studentEmail">
                <strong>Student Email:</strong> {request.users.email}
              </p>
              <p className="currentTeam">
                <strong>Current Team:</strong>{" "}
                {request.current_team ? teams[request.current_team] : "None"}
              </p>
              <p className="requestedTeam">
                <strong>Requested Team:</strong> {teams[request.new_team]}
              </p>
              <p className="requestMessage">
                <strong>Message:</strong> {request.message}
              </p>
              <div className="requestActions">
                <button
                  className="approveButton"
                  onClick={() =>
                    handleApprove(request.id, request.user_id, request.new_team)
                  }
                >
                  Approve
                </button>
                <button
                  className="rejectButton"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
