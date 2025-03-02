import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { gsap } from "gsap";
import "./code-editor.css";

const CodeEditor = ({ code, setCode, language, setLanguage, runCode }) => {
    const [theme, setTheme] = useState("vs-dark");
    const [font, setFont] = useState(14);
    const editorRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            editorRef.current,
            { opacity: 0, x: -300 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        );
    }, []);

    return (
        <div ref={editorRef} className="editor-container">
            {/* Editor Header with Left-aligned Dropdowns & Right-aligned Button */}
            <div className="editor-header">
                <div className="editor-controls">
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" onChange={(e) => setTheme(e.target.value)}>
                        <option value="vs-dark">Dark</option>
                        <option value="vs-light">Light</option>
                    </select>

                    <label htmlFor="language">Language:</label>
                    <select id="language" onChange={(e) => setLanguage(e.target.value)}>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="python">Python</option>
                    </select>

                    <label htmlFor="fontSize">Font Size:</label>
                    <select id="fontSize" onChange={(e) => setFont(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                        <option value={14} selected>14</option>
                        <option value={16}>16</option>
                        <option value={18}>18</option>
                    </select>
                </div>

                <div className="editor-buttons">
                    <button className="editor-button" onClick={runCode}>Run</button>
                </div>
            </div>

            {/* Monaco Editor */}
            <Editor
                className="editor"
                height="500px"
                theme={theme}
                language={language}
                value={code}
                onChange={(newValue) => setCode(newValue)}
                options={{
                    fontSize: font,
                    minimap: { enabled: true },
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
