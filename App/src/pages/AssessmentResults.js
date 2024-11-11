import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AssessmentResults = () => {
  const [students, setStudents] = useState([]);
  const [assessedStudents, setAssessedStudents] = useState([]);
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [selectedAssessed, setSelectedAssessed] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [conceptualAssessments, setConceptualAssessments] = useState([]);
  const [practicalAssessments, setPracticalAssessments] = useState([]);
  const [workEthicAssessments, setWorkEthicAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noAssessedMessage, setNoAssessedMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, email")
          .eq("is_teacher", false);

        if (error) {
          console.error("Error fetching students:", error.message);
          return;
        }

        setStudents(data);
      } catch (error) {
        console.error("Error loading data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAssessorChange = async (e) => {
    const assessorId = e.target.value;
    setSelectedAssessor(assessorId);
    setSelectedAssessed(null);
    setAssessments([]);
    setConceptualAssessments([]);
    setPracticalAssessments([]);
    setWorkEthicAssessments([]);
    setNoAssessedMessage("");

    const fetchAssessedStudents = async () => {
      try {
        const { data: peerData, error: peerError } = await supabase
          .from("Peer Assessment Questions")
          .select("Assessedmemberid, users(email)")
          .eq("Assessorid", assessorId);

        const { data: conceptualData, error: conceptualError } = await supabase
          .from("ConceptualContribution")
          .select("Assessedmemberid, users(email)")
          .eq("Assessorid", assessorId);

        const { data: practicalData, error: practicalError } = await supabase
          .from("PracticalContribution")
          .select("Assessedmemberid, users(email)")
          .eq("Assessorid", assessorId);

        const { data: workEthicData, error: workEthicError } = await supabase
          .from("WorkEthic")
          .select("Assessedmemberid, users(email)")
          .eq("Assessorid", assessorId);

        if (peerError || conceptualError || practicalError || workEthicError) {
          console.error(
            "Error fetching assessments:",
            peerError || conceptualError || practicalError || workEthicError
          );
          return;
        }

        const uniqueAssessed = [
          ...new Set([
            ...peerData.map((d) => d.Assessedmemberid),
            ...conceptualData.map((d) => d.Assessedmemberid),
            ...practicalData.map((d) => d.Assessedmemberid),
            ...workEthicData.map((d) => d.Assessedmemberid),
          ]),
        ];

        if (uniqueAssessed.length === 0) {
          setNoAssessedMessage("This assessor has not assessed any members.");
          setAssessedStudents([]);
        } else {
          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", uniqueAssessed);

          if (usersError) {
            console.error("Error fetching user emails:", usersError.message);
            return;
          }

          setAssessedStudents(usersData);
          setNoAssessedMessage("");
        }
      } catch (error) {
        console.error("Error loading assessed members:", error.message);
      }
    };

    fetchAssessedStudents();
  };

  const handleAssessedChange = async (e) => {
    const assessedId = e.target.value;
    setSelectedAssessed(assessedId);

    const fetchAssessments = async () => {
      try {
        const { data: peerData } = await supabase
          .from("Peer Assessment Questions")
          .select("*")
          .eq("Assessorid", selectedAssessor)
          .eq("Assessedmemberid", assessedId);

        const { data: conceptualData } = await supabase
          .from("ConceptualContribution")
          .select("*")
          .eq("Assessorid", selectedAssessor)
          .eq("Assessedmemberid", assessedId);

        const { data: practicalData } = await supabase
          .from("PracticalContribution")
          .select("*")
          .eq("Assessorid", selectedAssessor)
          .eq("Assessedmemberid", assessedId);

        const { data: workEthicData } = await supabase
          .from("WorkEthic")
          .select("*")
          .eq("Assessorid", selectedAssessor)
          .eq("Assessedmemberid", assessedId);

        setAssessments(peerData || []);
        setConceptualAssessments(conceptualData || []);
        setPracticalAssessments(practicalData || []);
        setWorkEthicAssessments(workEthicData || []);
      } catch (error) {
        console.error("Error loading assessment data:", error.message);
      }
    };

    fetchAssessments();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Assessment Results", 14, 10);

    const formatTable = (title, data, columns) => {
      if (data.length > 0) {
        doc.text(
          title,
          14,
          doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20
        );
        doc.autoTable({
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 25,
          columns,
          body: data,
        });
      }
    };

    formatTable("Peer Assessment Results", assessments, [
      { header: "Communication", dataKey: "Communication" },
      { header: "Participation", dataKey: "Participation" },
      { header: "Assistance", dataKey: "Assistance" },
      { header: "Respect", dataKey: "Respect" },
      { header: "Cooperation", dataKey: "Cooperation" },
      { header: "Conflict Resolution", dataKey: "Conflict_Resolution" },
      { header: "Adaptability", dataKey: "AdaptibilityandFlexibility" },
      { header: "Comments", dataKey: "Commentsection" },
    ]);

    formatTable("Conceptual Contribution Results", conceptualAssessments, [
      { header: "Conceptual 1", dataKey: "Conceptual1" },
      { header: "Conceptual 2", dataKey: "Conceptual2" },
      { header: "Conceptual 3", dataKey: "Conceptual3" },
      { header: "Conceptual 4", dataKey: "Conceptual4" },
      { header: "Conceptual 5", dataKey: "Conceptual5" },
      { header: "Conceptual 6", dataKey: "Conceptual6" },
      { header: "Conceptual 7", dataKey: "Conceptual7" },
      { header: "Comments", dataKey: "ConceptualComment" },
    ]);

    formatTable("Practical Contribution Results", practicalAssessments, [
      { header: "Practical 1", dataKey: "Practical1" },
      { header: "Practical 2", dataKey: "Practical2" },
      { header: "Practical 3", dataKey: "Practical3" },
      { header: "Practical 4", dataKey: "Practical4" },
      { header: "Practical 5", dataKey: "Practical5" },
      { header: "Practical 6", dataKey: "Practical6" },
      { header: "Practical 7", dataKey: "Practical7" },
      { header: "Comments", dataKey: "PracticalComment" },
    ]);

    formatTable("Work Ethic Results", workEthicAssessments, [
      { header: "Work 1", dataKey: "Work1" },
      { header: "Work 2", dataKey: "Work2" },
      { header: "Work 3", dataKey: "Work3" },
      { header: "Work 4", dataKey: "Work4" },
      { header: "Work 5", dataKey: "Work5" },
      { header: "Work 6", dataKey: "Work6" },
      { header: "Work 7", dataKey: "Work7" },
      { header: "Comments", dataKey: "WorkComment" },
    ]);

    doc.save("Assessment_Results.pdf");
  };

  const csvData = [
    ...assessments.map((assessment) => ({
      ...assessment,
      Dimension: "Peer",
    })),
    ...conceptualAssessments.map((assessment) => ({
      ...assessment,
      Dimension: "Conceptual",
    })),
    ...practicalAssessments.map((assessment) => ({
      ...assessment,
      Dimension: "Practical",
    })),
    ...workEthicAssessments.map((assessment) => ({
      ...assessment,
      Dimension: "Work Ethic",
    })),
  ];

  if (loading) return <p className="loading-message">Loading students...</p>;

  return (
    <div className="container">
      <header className="header1">
        <h2>Select Assessor and Assessed Student</h2>
      </header>

      <div className="results-selection">
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
            {noAssessedMessage ? (
              <p className="no-assessed-message">{noAssessedMessage}</p>
            ) : (
              <>
                <label>Select Assessed Student:</label>
                <select
                  onChange={handleAssessedChange}
                  value={selectedAssessed || ""}
                >
                  <option value="">-- Select an Assessed Student --</option>
                  {assessedStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.email}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        )}
      </div>

      {selectedAssessed && (
        <div className="results-container">
          {/* Buttons for CSV and PDF export */}
          <div className="button-container">
            <CSVLink
              data={csvData}
              filename="Assessment_Results.csv"
              className="export-button"
            >
              Export as CSV
            </CSVLink>
            <button onClick={exportToPDF} className="export-button">
              Export as PDF
            </button>
          </div>

          {/* Display assessment tables */}
          {/* Peer Assessment Results */}
          {assessments.length > 0 && (
            <div className="results-table">
              <h3>Peer Assessment Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Communication</th>
                    <th>Participation</th>
                    <th>Assistance</th>
                    <th>Respect</th>
                    <th>Cooperation</th>
                    <th>Conflict Resolution</th>
                    <th>Adaptability</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>{assessment.Communication}</td>
                      <td>{assessment.Participation}</td>
                      <td>{assessment.Assistance}</td>
                      <td>{assessment.Respect}</td>
                      <td>{assessment.Cooperation}</td>
                      <td>{assessment.Conflict_Resolution}</td>
                      <td>{assessment.AdaptibilityandFlexibility}</td>
                      <td>{assessment.Commentsection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Conceptual Contribution Results */}
          {conceptualAssessments.length > 0 && (
            <div className="results-table">
              <h3>Conceptual Contribution Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Conceptual 1</th>
                    <th>Conceptual 2</th>
                    <th>Conceptual 3</th>
                    <th>Conceptual 4</th>
                    <th>Conceptual 5</th>
                    <th>Conceptual 6</th>
                    <th>Conceptual 7</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {conceptualAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>{assessment.Conceptual1}</td>
                      <td>{assessment.Conceptual2}</td>
                      <td>{assessment.Conceptual3}</td>
                      <td>{assessment.Conceptual4}</td>
                      <td>{assessment.Conceptual5}</td>
                      <td>{assessment.Conceptual6}</td>
                      <td>{assessment.Conceptual7}</td>
                      <td>{assessment.ConceptualComment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Practical Contribution Results */}
          {practicalAssessments.length > 0 && (
            <div className="results-table">
              <h3>Practical Contribution Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Practical 1</th>
                    <th>Practical 2</th>
                    <th>Practical 3</th>
                    <th>Practical 4</th>
                    <th>Practical 5</th>
                    <th>Practical 6</th>
                    <th>Practical 7</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {practicalAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>{assessment.Practical1}</td>
                      <td>{assessment.Practical2}</td>
                      <td>{assessment.Practical3}</td>
                      <td>{assessment.Practical4}</td>
                      <td>{assessment.Practical5}</td>
                      <td>{assessment.Practical6}</td>
                      <td>{assessment.Practical7}</td>
                      <td>{assessment.PracticalComment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Work Ethic Results */}
          {workEthicAssessments.length > 0 && (
            <div className="results-table">
              <h3>Work Ethic Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Work 1</th>
                    <th>Work 2</th>
                    <th>Work 3</th>
                    <th>Work 4</th>
                    <th>Work 5</th>
                    <th>Work 6</th>
                    <th>Work 7</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {workEthicAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>{assessment.Work1}</td>
                      <td>{assessment.Work2}</td>
                      <td>{assessment.Work3}</td>
                      <td>{assessment.Work4}</td>
                      <td>{assessment.Work5}</td>
                      <td>{assessment.Work6}</td>
                      <td>{assessment.Work7}</td>
                      <td>{assessment.WorkComment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentResults;
