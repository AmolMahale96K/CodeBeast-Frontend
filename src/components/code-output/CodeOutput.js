import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./code-output.css";

function CodeOutput({ input, setInput, output }) {
    const outputRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            outputRef.current,
            { opacity: 0, y: 30 }, // Reduced animation distance
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" } // Faster animation
        );
    }, []);

    return (
        <div ref={outputRef} className="output-div">
            <label htmlFor="input" className="result-label">Input :</label>
            <textarea
                className="input-box"
                id="input"
                rows={4} // Reduced rows to fit better
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <label htmlFor="output" className="result-label">Output :</label>
            <div id="output" className="result-div">
                <pre>{output || "No output yet"}</pre>
            </div>
        </div>
    );
}

export default CodeOutput;
