import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./assignments.css";
import jwt_decode from "jwt-decode";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Function to get userId from the JWT token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        if (!token) {
            throw new Error("User is not authenticated");
        }

        // Decode the JWT token to extract the user ID
        const decodedToken = jwt_decode(token);

        // Extract userId (it could be 'id' or 'sub' depending on how your JWT is structured)
        const userId = decodedToken.id || decodedToken.sub;
        return userId;
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/assignments`);
                if (!response.ok) throw new Error("Failed to fetch assignments");

                const data = await response.json();
                setAssignments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments(); // Fetch assignments only once when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once on mount

    const handleAssignmentClick = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const startAssignment = () => {
        setShowModal(false);
        if (selectedAssignment) {
            // Update local UI immediately
            setAssignments(prevAssignments =>
                prevAssignments.map(assignment =>
                    assignment._id === selectedAssignment._id
                        ? { ...assignment, completed: true }
                        : assignment
                )
            );

            // Navigate to assignment page
            navigate(`/dashboard/assignment/${selectedAssignment._id}`);
        }
    };

    return (
        <div className="assignments-container">
            <h2>📘 Assignments</h2>

            {loading ? (
                <p>Loading assignments...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : assignments.length > 0 ? (
                <div className="assignment-list">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment._id}
                            className={`assignment-card ${Array.isArray(assignment.solved) && assignment.solved.includes(userId) ? "completed" : ""}`}
                            onClick={() => handleAssignmentClick(assignment)}
                        >
                            <h3>{assignment.name}</h3>
                            {Array.isArray(assignment.solved) && assignment.solved.includes(userId) ? (
                                <span className="status completed">✅ Completed</span>
                            ) : (
                                <span className="status pending">⏳ In Progress</span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-assignments">
                    <h3>No Assignments Available!</h3>
                    <p>Check back later for new challenges.</p>
                </div>
            )}

            {showModal && selectedAssignment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Start Assignment</h2>
                        <p>📌 <strong>{selectedAssignment.name}</strong></p>
                        <p>Make sure you have enough time to complete this challenge.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                            <button onClick={startAssignment} className="start-btn">Start</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
