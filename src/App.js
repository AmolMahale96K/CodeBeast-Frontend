import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Header from "./components/header/Header";
import CodeEditor from "./components/code-editor/CodeEditor";
import CodeOutput from "./components/code-output/CodeOutput";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("// Write your code here...\n");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("c");
  const [allData, setAllData] = useState({});

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/run", {
        source_code: code,
        language: language,
        input: input,
      });

      const { id } = response.data;
      if (!id) {
        setOutput("Error: No execution ID received");
        return;
      }

      let status;
      do {
        await new Promise(res => setTimeout(res, 2000));
        const statusResponse = await axios.get(`http://localhost:5000/status?id=${id}`);
        status = statusResponse.data.status;
      } while (status !== "completed");

      const outputResponse = await axios.get(`http://localhost:5000/output?id=${id}`);
      setAllData(outputResponse);
      // console.log(allData);
      setOutput(outputResponse.data.stdout || outputResponse.data.stderr || "No output");
    } catch (error) {
      console.error("Error:", error.message);
      setOutput("Error executing code");
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="code">
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          language={language} 
          setLanguage={setLanguage} 
          runCode={runCode} 
        />
        <CodeOutput 
          input={input} 
          setInput={setInput} 
          output={output} 
        />
      </div>
    </div>
  );
}

export default App;
