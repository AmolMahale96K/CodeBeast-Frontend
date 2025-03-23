import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import axios from "axios"; // Import axios for API call
import "./dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null); // Initially null to handle loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Error loading user data.</p>;

  // Ensure testScores exists before mapping
  const testPerformanceData = (student.testScores || []).map((score, index) => ({
    name: `Test ${index + 1}`,
    score,
  }));

  const assignmentData = [
    { name: "Completed", value: student.completedAssignments || 0 },
    { name: "Pending", value: student.pendingAssignments || 0 },
  ];

  const overallData = [
    { name: "Assignments", Completed: student.completedAssignments || 0, Pending: student.pendingAssignments || 0 },
    { name: "Tests", Attempted: student.attemptedTests || 0, Pending: student.pendingTests || 0 },
  ];

  return (

    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {student.name}!</h2>

      {/* Student Profile Section */}
      <div className="student-info">
        <img src={`http://localhost:5000${student.profilePic}`} alt="Profile" className="profile-pic" />
        <h3 className="student-name">{student.name}</h3>
        <p className="student-email">{student.email}</p>
      </div>

      {/* Overall Rank Section */}
      <div className="dashboard-card rank-card" onClick={() => navigate("/leaderboard")}>
        <h4>Overall Rank</h4>
        <p>#{student.overallRank || "N/A"}</p>
      </div>

      {/* Graphs Section */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Assignment Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={assignmentData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {assignmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Test Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={testPerformanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Progress Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Completed" fill="#00C49F" />
            <Bar dataKey="Pending" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
