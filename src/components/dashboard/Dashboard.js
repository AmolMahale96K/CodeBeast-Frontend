import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import "./dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profile: "https://via.placeholder.com/100",
    completedAssignments: 7,
    pendingAssignments: 3,
    attemptedTests: 3,
    pendingTests: 2,
    overallRank: 5,
    testScores: [65, 72, 80, 85, 90], // Example Test Scores for graph
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Pie Chart Data (Assignments)
  const assignmentData = [
    { name: "Completed", value: student.completedAssignments },
    { name: "Pending", value: student.pendingAssignments },
  ];

  // Line Chart Data (Test Scores Over Time)
  const testPerformanceData = student.testScores.map((score, index) => ({
    name: `Test ${index + 1}`,
    score,
  }));

  // Bar Chart Data (Overall Stats)
  const overallData = [
    { name: "Assignments", Completed: student.completedAssignments, Pending: student.pendingAssignments },
    { name: "Tests", Attempted: student.attemptedTests, Pending: student.pendingTests },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {student.name}!</h2>

      {/* Student Profile Section */}
      <div className="student-info">
        <img src={student.profile} alt="Profile" className="profile-pic" />
        <h3 className="student-name">{student.name}</h3>
        <p className="student-email">{student.email}</p>
      </div>

      {/* Overall Rank Section */}
      <div className="dashboard-card rank-card" onClick={() => navigate("/leaderboard")}>
        <h4>Overall Rank</h4>
        <p>#{student.overallRank}</p>
      </div>

      {/* Graphs Section */}
      <div className="charts-container">
        {/* Assignment Pie Chart */}
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

        {/* Test Performance Line Chart */}
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

      {/* Overall Stats Bar Chart */}
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
