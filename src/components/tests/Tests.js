import React, { useState, useEffect } from "react";
import "./tests.css";

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [activeTestId, setActiveTestId] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setTests([
                { id: 1, name: "Java Basics", totalQuestions: 10, solved: 7, completed: false },
                { id: 2, name: "React Advanced", totalQuestions: 15, solved: 15, completed: true },
                { id: 3, name: "Data Structures", totalQuestions: 12, solved: 8, completed: false },
            ]);
        }, 1000);
    }, []);

    const handleStartTest = (id) => {
        if (!activeTestId) {
            setActiveTestId(id);
        }
    };

    return (
        <div className="tests-container">
            <h2>📝 Tests Dashboard</h2>

            {/* Test List */}
            {tests.length > 0 ? (
                <div className="test-list">
                    {tests.map((test) => (
                        <div 
                            key={test.id} 
                            className={`test-card ${test.completed ? "completed" : ""} ${activeTestId && activeTestId !== test.id ? "disabled" : ""}`}
                            onClick={() => handleStartTest(test.id)}
                        >
                            <h3>{test.name}</h3>
                            <p>Questions Solved: {test.solved}/{test.totalQuestions} Que</p>

                            {test.completed ? (
                                <span className="status completed">✅ Completed</span>
                            ) : activeTestId === test.id ? (
                                <span className="status active">🚀 In Progress</span>
                            ) : (
                                <span className="status pending">{activeTestId ? "⛔ Locked" : "▶ Start Test"}</span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-tests">
                    <h3>Oops! No Tests Available 😵</h3>
                </div>
            )}
        </div>
    );
};

export default Tests;
