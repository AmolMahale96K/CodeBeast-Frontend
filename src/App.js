import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/header/Header";
import CodeEditor from "./components/code-editor/CodeEditor";
import CodeOutput from "./components/code-output/CodeOutput";
import NotAllow from "./components/not-allow/NotAllow";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Footer from "./components/footer/Footer";
import About from "./components/about/About";
import Dashboard from "./components/dashboard/Dashboard";
import SubNav from "./components/nav/SubNav";
import Assignments from "./components/assignment/Assignment";
import Tests from "./components/tests/Tests";
import AssignmentPage from "./components/assignment/AssignmentPage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function App() {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("// Write code here .....\n");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("java");
    const [isMobile, setIsMobile] = useState(false);
    const aboutRef = useRef(null);
    const footerRef = useRef(null);
    
    const navigate = useNavigate(); // Move inside Router context

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        }, observerOptions);

        if (aboutRef.current) observer.observe(aboutRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        return () => {
            if (aboutRef.current) observer.unobserve(aboutRef.current);
            if (footerRef.current) observer.unobserve(footerRef.current);
        };
    }, []);

    if (isMobile) {
        return <NotAllow />;
    }

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

    return (
        <div className="App">
            <Header />
            <ToastContainer />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <div className="code">
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    language={language}
                                    setLanguage={setLanguage}
                                    runCode={runCode}
                                />
                                <CodeOutput input={input} setInput={setInput} output={output} />
                            </div>

                            {/* About and Footer will animate on scroll */}
                            <div ref={aboutRef} className="about-container">
                                <About />
                            </div>
                            <div ref={footerRef} className="footer-container">
                                <Footer />
                            </div>
                        </>
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/About" element={<About />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="assignment/:id" element={<AssignmentPage />} />
                    <Route path="assignments" element={<Assignments />} />
                    <Route path="tests" element={<Tests />} />
                </Route>
            </Routes>
        </div>
    );
}

const DashboardLayout = () => {
    return (
        <>
            <SubNav />
            <Outlet /> {/* This will render the nested route content */}
        </>
    );
};

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
