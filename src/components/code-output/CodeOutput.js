import React from "react";
import "./code-output.css";

function CodeOutput({ input, setInput, output }) {
    return (
        <div className="output-div">
            <label htmlFor="input" className="result-label">Input : </label>
            <textarea
                className="input-box"
                id="input"
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <label htmlFor="output" className="result-label">Output : </label>
            <div id="output" className={ "result-div"} >
                <pre>{output || "No output yet"}</pre>
            </div>
        </div>
    );
}

export default CodeOutput;
