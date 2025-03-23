import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../code-editor/CodeEditor";
import CodeOutput from "../code-output/CodeOutput";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assignmentPage.css";

const AssignmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("java");
    const [output, setOutput] = useState("");
    const [testCases, setTestCases] = useState([]);
    const [passedCountInfo, setPassedCountInfo] = useState("");
    const [input, setInput] = useState("");  // Add this line to define input state



    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`${API_URL}/assignments/${id}`);
                setAssignment(response.data);
                setTestCases(response.data.question.testCases || []);
            } catch (err) {
                setError("❌ Failed to load assignment details");
                toast.error("Failed to fetch assignment!");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id]);

    const updateDatabaseOnSuccess = async (id) => {
        try {
            await axios.put(`${API_URL}/assignments/${id}/solve`);
            toast.success("✅ Assignment marked as solved!");
        } catch (error) {
            toast.error("❌ Error updating assignment.");
        }
    };
    

    const submitCode = async () => {
        if (!code.trim()) {
            toast.error("❌ Please write some code before submitting.");
            return;
        }
    
        setOutput("Compiling...");
        toast.info("🚀 Running test cases...");
    
        let passedCount = 0;
        let totalCases = testCases.length;
        let resultSummary = "";
    
        for (let i = 0; i < totalCases; i++) {
            const testCase = testCases[i];
    
            try {
                // Step 1: Send code execution request
                const response = await axios.post(`${API_URL}/run`, {
                    source_code: code,
                    language,
                    input: testCase.input,
                });
    
                const { id: execId } = response.data;
                if (!execId) throw new Error("No execution ID received");
    
                let attempts = 0;
                const maxAttempts = 5;
                let actualOutput = "Execution Failed";
    
                // Step 2: Poll for execution status
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts))); // Exponential backoff
    
                    const statusResponse = await axios.get(`${API_URL}/status?id=${execId}`);
                    if (statusResponse.data.status === "completed") {
                        const outputResponse = await axios.get(`${API_URL}/output?id=${execId}`);
                        actualOutput = outputResponse.data.stdout?.trim() || "No Output";
                        break;
                    }
                    attempts++;
                }
    
                const expectedOutput = testCase.expectedOutput.toString().trim();
                const passed = actualOutput === expectedOutput;
    
                if (passed) passedCount++;
    
                // Update the result summary
                resultSummary += `📝 Test Case ${i + 1}: ${passed ? "✅ Passed" : "❌ Failed"}\n` +
                    `📥 Input: ${testCase.input}\n` +
                    `🎯 Expected: ${expectedOutput}\n` +
                    `📌 Actual: ${actualOutput}\n\n`;
    
            } catch (error) {
                resultSummary += `❌ Error executing Test Case ${i + 1}\n\n`;
            }
        }
    
        // Update output and test case result info
        setOutput(resultSummary);
        setPassedCountInfo(`✅ ${passedCount}/${totalCases} test cases passed!`);
        toast.info(`✅ ${passedCount}/${totalCases} test cases passed!`);
    
        if (passedCount === totalCases) {
            await updateDatabaseOnSuccess(id); // Pass the assignment ID
            setTimeout(() => navigate("/dashboard/assignments"), 3000);
        }
        
    };

    const runCode = async () => {
        try {
            setOutput("Compiling...");
            toast.info("Compiling code...", { autoClose: 2000 });

            const response = await axios.post(`${API_URL}/run`, {
                source_code: code,
                language: language,
                input: input,
            });

            const { id } = response.data;
            if (!id) {
                setOutput("Error: No execution ID received");
                toast.error("Error: No execution ID received");
                return;
            }

            let attempts = 0;
            const maxAttempts = 10;
            const baseDelay = 1000;

            const checkStatus = async () => {
                if (attempts >= maxAttempts) {
                    setOutput("Execution timed out.");
                    toast.error("Execution timed out.");
                    return;
                }

                try {
                    const statusResponse = await axios.get(`${API_URL}/status?id=${id}`);
                    const status = statusResponse.data.status;

                    if (status === "completed") {
                        const outputResponse = await axios.get(`${API_URL}/output?id=${id}`);
                        const stdout = outputResponse.data.stdout;
                        const stderr = outputResponse.data.stderr;
                        
                        if (stdout) {
                            setOutput(stdout);
                            toast.success("Code executed successfully!", { autoClose: 2000 });
                        } else {
                            setOutput(stderr || "No output received.");
                            toast.error(stderr || "Error: No output received.");
                        }
                    } else {
                        attempts++;
                        const nextDelay = baseDelay * Math.pow(2, attempts);
                        setTimeout(checkStatus, nextDelay);
                    }
                } catch (error) {
                    setOutput("Error fetching execution status");
                    toast.error("Error fetching execution status");
                }
            };

            checkStatus();
        } catch (error) {
            console.error("Error:", error.message);
            setOutput("Error executing code");
            toast.error("Error executing code");
        }
    };
    

    if (loading) return <p>Loading assignment...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <>
            <ToastContainer />
            <h2>📝 Assignment: {assignment?.name}</h2>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Assignment</td>
                            <td>{assignment?.question?.questionText}</td>
                        </tr>
                        <tr>
                            <td>Sample Input</td>
                            <td>{assignment?.question?.testCases?.[0]?.input || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Sample Output</td>
                            <td>{assignment?.question?.testCases?.[0]?.expectedOutput ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>{passedCountInfo}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="exam-container">
                <button className="submit-btn" onClick={submitCode}>Submit</button>
                <div className="code-container">
                    <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} runCode={runCode} />
                    <CodeOutput input={input} setInput={setInput} output={output} />
                </div>
            </div>
        </>
    );
};

export default AssignmentPage;
