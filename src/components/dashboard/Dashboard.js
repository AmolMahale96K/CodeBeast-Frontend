import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios"; // Import axios for API call
import jwt_decode from "jwt-decode";  // Import the JWT decode library
import "./dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user profile and assignments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          navigate("/");
          return;
        }

        // Decode the JWT token to get the user ID
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id); // Assuming the user ID is stored as 'id' in the token

        // Fetch user profile
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);

        // Fetch assignments
        const assignmentsResponse = await axios.get("http://localhost:5000/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(assignmentsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!student) return <p>Error loading user data.</p>;

  // Count solved and pending assignments based on userId
  const completedAssignments = assignments.filter(
    (assignment) => Array.isArray(assignment.solved) && assignment.solved.includes(userId)
  ).length;

  const pendingAssignments = assignments.filter(
    (assignment) => !Array.isArray(assignment.solved) || !assignment.solved.includes(userId)
  ).length;

  const assignmentData = [
    { name: "Completed", value: completedAssignments },
    { name: "Pending", value: pendingAssignments },
  ];

  const overallData = [
    { name: "Assignments", Completed: completedAssignments, Pending: pendingAssignments },
    { name: "Tests", Attempted: student.attemptedTests || 0, Pending: student.pendingTests || 0 },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {student.name}!</h2>

      {/* Student Profile Section */}
      <div className="student-info">
        <img
          src={`http://localhost:5000${student.profilePic}`}
          alt="Profile"
          className="profile-pic"
        />
        <h3 className="student-name">{student.name}</h3>
        <p className="student-email">{student.email}</p>
      </div>

      {/* Overall Rank Section */}
      <div
        className="dashboard-card rank-card"
        onClick={() => navigate("/leaderboard")}
      >
        <h4>Overall Rank</h4>
        <p>#{student.overallRank || "N/A"}</p>
      </div>

      {/* Graphs Section */}
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
