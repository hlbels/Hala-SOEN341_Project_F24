import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import {
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

const Analysis = () => {
  const [students, setStudents] = useState([]);
  const [assessedStudents, setAssessedStudents] = useState([]);
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [selectedAssessed, setSelectedAssessed] = useState(null);
  const [assessmentData, setAssessmentData] = useState({});
  const [metrics, setMetrics] = useState({});
  const [selectedDimension, setSelectedDimension] = useState("Cooperation");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dimensions = {
    Cooperation: "Peer Assessment Questions",
    Conceptual: "ConceptualContribution",
    Practical: "PracticalContribution",
    WorkEthic: "WorkEthic",
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email")
        .eq("is_teacher", false);
      if (error) {
        console.error("Error fetching students:", error.message);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const handleAssessorChange = async (e) => {
    const assessorId = e.target.value;
    setSelectedAssessor(assessorId);
    setSelectedAssessed(null);
    setAssessmentData({});
    setMetrics({});
    setSelectedDimension("Cooperation");

    const { data: assessedData } = await supabase
      .from("Peer Assessment Questions")
      .select("Assessedmemberid, users(email)")
      .eq("Assessorid", assessorId);

    setAssessedStudents(assessedData || []);
  };

  const handleAssessedChange = async (e) => {
    const assessedId = e.target.value;
    setSelectedAssessed(assessedId);
    fetchAllDimensionsData(assessedId);
  };

  const fetchAllDimensionsData = async (assessedId) => {
    const newAssessmentData = {};
    for (const dimension in dimensions) {
      const table = dimensions[dimension];
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("Assessorid", selectedAssessor)
        .eq("Assessedmemberid", assessedId);
      newAssessmentData[dimension] = data;
      calculateMetrics(dimension, data);
    }
    setAssessmentData(newAssessmentData);
  };

  const calculateMetrics = (dimension, data) => {
    const dimensionFields = {
      Cooperation: [
        "Communication",
        "Participation",
        "Assistance",
        "Respect",
        "Cooperation",
        "Conflict_Resolution",
        "AdaptibilityandFlexibility",
      ],
      Conceptual: [
        "Conceptual1",
        "Conceptual2",
        "Conceptual3",
        "Conceptual4",
        "Conceptual5",
        "Conceptual6",
        "Conceptual7",
      ],
      Practical: [
        "Practical1",
        "Practical2",
        "Practical3",
        "Practical4",
        "Practical5",
        "Practical6",
        "Practical7",
      ],
      WorkEthic: [
        "Work1",
        "Work2",
        "Work3",
        "Work4",
        "Work5",
        "Work6",
        "Work7",
      ],
    };

    const fields = dimensionFields[dimension];
    let totalScore = 0;
    const scores = {};
    fields.forEach((field) => (scores[field] = []));

    data.forEach((entry) => {
      fields.forEach((field) => {
        const score = entry[field] || 0;
        scores[field].push(score);
        totalScore += score;
      });
    });

    const dimensionMetrics = {};
    dimensionMetrics.totalAverage = (
      totalScore /
      (data.length * fields.length)
    ).toFixed(2);
    dimensionMetrics.fields = fields.map((field) => {
      const avg = (
        scores[field].reduce((sum, score) => sum + score, 0) /
        scores[field].length
      ).toFixed(2);
      const percentage = ((avg / 5) * 100).toFixed(2);
      const stdDev = Math.sqrt(
        scores[field]
          .map((score) => Math.pow(score - avg, 2))
          .reduce((sum, sq) => sum + sq, 0) / scores[field].length
      ).toFixed(2);

      return {
        field,
        avg,
        percentage,
        stdDev,
        highest: Math.max(...scores[field]),
        lowest: Math.min(...scores[field]),
      };
    });

    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      [dimension]: dimensionMetrics,
    }));
  };

  const calculateOverallMetrics = () => {
    const overallMetrics = { fields: [] };
    let totalAverageSum = 0;

    for (const dimension in metrics) {
      const dimensionMetrics = metrics[dimension];
      totalAverageSum += parseFloat(dimensionMetrics.totalAverage);

      dimensionMetrics.fields.forEach((fieldData) => {
        const fieldIndex = overallMetrics.fields.findIndex(
          (f) => f.field === fieldData.field
        );
        if (fieldIndex === -1) {
          overallMetrics.fields.push({ ...fieldData });
        } else {
          const field = overallMetrics.fields[fieldIndex];
          field.avg = (
            (parseFloat(field.avg) + parseFloat(fieldData.avg)) /
            2
          ).toFixed(2);
          field.percentage = (
            (parseFloat(field.percentage) + parseFloat(fieldData.percentage)) /
            2
          ).toFixed(2);
          field.stdDev = (
            (parseFloat(field.stdDev) + parseFloat(fieldData.stdDev)) /
            2
          ).toFixed(2);
          field.highest = Math.max(field.highest, fieldData.highest);
          field.lowest = Math.min(field.lowest, fieldData.lowest);
        }
      });
    }

    overallMetrics.totalAverage = (
      totalAverageSum / Object.keys(metrics).length
    ).toFixed(2);
    return overallMetrics;
  };

  const overallMetrics =
    selectedDimension === "Overall"
      ? calculateOverallMetrics()
      : metrics[selectedDimension];

  return (
    <div className="container">
      <header className="header1">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2>
          PINSIGHTS <br /> Peer Assessment
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

      <header className="Team Performance Insights">
        <h2>Team Performance Insights</h2>
      </header>

      <div className="selection-section">
        <label>Select Assessor:</label>
        <select onChange={handleAssessorChange} value={selectedAssessor || ""}>
          <option value="">-- Select an Assessor --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.email}
            </option>
          ))}
        </select>

        {selectedAssessor && (
          <>
            <label>Select Assessed Student:</label>
            <select
              onChange={handleAssessedChange}
              value={selectedAssessed || ""}
            >
              <option value="">-- Select an Assessed Student --</option>
              {assessedStudents.map((student) => (
                <option
                  key={student.Assessedmemberid}
                  value={student.Assessedmemberid}
                >
                  {student.users.email}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {selectedAssessed && (
        <div className="dimension-buttons">
          {Object.keys(dimensions).map((dim) => (
            <button key={dim} onClick={() => setSelectedDimension(dim)}>
              {dim}
            </button>
          ))}
          <button onClick={() => setSelectedDimension("Overall")}>
            Overall
          </button>
        </div>
      )}

      {selectedAssessed && overallMetrics && (
        <div className="analysis-section">
          <h3>{selectedDimension} Assessment Analysis</h3>
          <p>
            <strong>Overall Average Score:</strong>{" "}
            {overallMetrics.totalAverage} / 5
          </p>

          <table className="analysis-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Average Score</th>
                <th>Percentage</th>
                <th>Std. Dev.</th>
                <th>Highest Score</th>
                <th>Lowest Score</th>
              </tr>
            </thead>
            <tbody>
              {overallMetrics.fields.map((field, index) => (
                <tr key={index}>
                  <td>{field.field}</td>
                  <td>{field.avg}</td>
                  <td>{field.percentage}%</td>
                  <td>{field.stdDev}</td>
                  <td>{field.highest}</td>
                  <td>{field.lowest}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="charts">
            <h4>Visual Representation</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={overallMetrics.fields}>
                <PolarGrid />
                <PolarAngleAxis dataKey="field" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar
                  dataKey="avg"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallMetrics.fields}>
                <XAxis dataKey="field" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill="#82ca9d" />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
