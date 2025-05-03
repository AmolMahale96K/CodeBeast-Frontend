import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const API_URL = process.env.REACT_APP_API_URL.slice(0,-4)

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({}); // Set empty object as initial state
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          navigate("/");
          return;
        }
  
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id);
  
        // Fetch user profile
        const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(profileResponse.data);
  
        // Fetch all assignments
        const assignmentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(assignmentsResponse.data);
  
        // Fetch user assignments
        const userAssignmentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/userassignments/getassignmentbyuser?userId=${decodedToken.id}`
        );
  
        if (userAssignmentsResponse.data.length === 0) {
          // If no assignments found, set dummy data
          setUserAssignments([{ assignmentId: "", passTestCases: 0 }]);
        } else {
          setUserAssignments(userAssignmentsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);
  

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // If no student data, show a default message
  if (!student.name) return <p>No user found. Please log in again.</p>;

  // Pie chart data
  const completedAssignments = assignments.filter(
    (assignment) => Array.isArray(assignment.solved) && assignment.solved.includes(userId)
  ).length;

  const pendingAssignments = assignments.length - completedAssignments;

  const assignmentData = [
    { name: "Completed", value: completedAssignments },
    { name: "Pending", value: pendingAssignments },
  ];

  // Create a map of solved assignments for quick lookup
  const solvedAssignmentMap = {};
  userAssignments.forEach((ua) => {
    if (ua.assignmentId) {
      solvedAssignmentMap[ua.assignmentId] = true;
    }
  });

  // Bar chart data
  const barGraphData = assignments.map((assignment) => {
    const userAssignment = userAssignments.find((ua) => ua.assignmentId === assignment._id);

    const totalTestCases = userAssignment ? assignment.question.testCases.length : 0;
    const passedTestCases = userAssignment ? userAssignment.passTestCases : 0;

    const percentage = totalTestCases > 0 ? ((passedTestCases / totalTestCases) * 100).toFixed(2) : 0;

    return {
      assignmentName: assignment.name,
      totalTestCases,
      passedTestCases,
      percentage: Number(percentage),
      status: solvedAssignmentMap[assignment._id] ? "Completed" : "Pending",
    };
  });



  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {student.name || "Student"}!</h2>

      {/* Student Info */}
      <div className="student-info">
        <img
          src={`${API_URL}${student.profilePic}`}
          alt="Profile"
          className="profile-pic"
        />
        <h3 className="student-name">{student.name || "No Name"}</h3>
        <p className="student-email">{student.email || "No Email"}</p>
      </div>

      {/* Rank Card */}
      <div
        className="dashboard-card rank-card"
        onClick={() => navigate("/leaderboard")}
      >
        <h4>Overall Rank</h4>
        <p>#{student.overallRank || "N/A"}</p>
      </div>

      {/* Pie Chart */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Assignment Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assignmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {assignmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Assignment Test Case Performance</h3>
          {barGraphData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={barGraphData} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignmentName" angle={-90} textAnchor="end" />
                <YAxis />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <p>{`Assignment: ${data.assignmentName}`}</p>
                          <p>{`Total Test Cases: ${data.totalTestCases}`}</p>
                          <p>{`Passed Test Cases: ${data.passedTestCases}`}</p>
                          <p>{`Pass Percentage: ${data.percentage}%`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No test case data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
