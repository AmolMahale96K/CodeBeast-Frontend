import React, { useState, useEffect } from "react";
import "./assignments.css";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setAssignments([
                { id: 1, name: "Data Structures Basics", totalQuestions: 10, solved: 5, completed: false },
                { id: 2, name: "React Fundamentals", totalQuestions: 8, solved: 8, completed: true },
                { id: 3, name: "Algorithms", totalQuestions: 12, solved: 6, completed: false },
            ]);
        }, 1000);
    }, []);

    return (
        <div className="assignments-container">
            <h2>📘 Assignments</h2>

            {assignments.length > 0 ? (
                <div className="assignment-list">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className={`assignment-card ${assignment.completed ? "completed" : ""}`}>
                            <h3>{assignment.name}</h3>
                            <p>Questions Solved: {assignment.solved}/{assignment.totalQuestions}</p>
                            {assignment.completed ? (
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
        </div>
    );
};

export default Assignments;
