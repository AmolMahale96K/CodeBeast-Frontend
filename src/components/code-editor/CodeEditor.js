import React from "react";
import { Editor } from "@monaco-editor/react";
import "./code-editor.css";
import "./button-style.css";

const CodeEditor = ({ code, setCode, language, setLanguage, runCode }) => {
    const [theme, setTheme] = React.useState("vs-dark");
    const [font, setFont] = React.useState(14);

    return (
        <div className="editor-container">
            <div className="editor-header">
                <label htmlFor="theme">Theme : </label>
                <select id="theme" onChange={(e) => setTheme(e.target.value)}>
                    <option value="vs-dark">Dark</option>
                    <option value="vs-light">Light</option>
                </select>

                <label htmlFor="language">Language : </label>
                <select id="language" onChange={(e) => setLanguage(e.target.value)}>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="python">Python</option>
                </select>

                <label htmlFor="fontSize">Font Size : </label>
                <select id="fontSize" onChange={(e) => setFont(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={12}>12</option>
                    <option value={14}>14</option>
                    <option value={16}>16</option>
                    <option value={18}>18</option>
                </select>
            </div>

            <Editor
                className="editor"
                height="550px"
                theme={theme}
                language={language}
                value={code}
                onChange={(newValue) => setCode(newValue)}
                options={{
                    fontSize: font,
                    minimap: { enabled: true },
                    lineNumbers: "on",
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                }}
            />

            <div className="editor-buttons-div">
                <button className="editor-button" onClick={runCode}>Run Code</button>
            </div>
        </div>
    );
};

export default CodeEditor;
