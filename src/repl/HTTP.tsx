import { useState } from "react";
import Editor from "./Editor";

type Props = {
  paths: string[];
};

const HTTPRepl = ({ paths }: Props) => {
  const [output, setOutput] = useState("Click the send to try it out!");
  const [input, setInput] = useState("{}");
  const [selectedPath, setSelectedPath] = useState(paths[0]);
  const [method, setMethod] = useState("GET");

  const handleSubmit = async () => {
    setOutput("Loading...");
    const response = await fetch(`/proxy${selectedPath}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? JSON.stringify(input) : undefined,
    });

    setOutput(await response.text());
  };

  return (
    <div className="flex flex-col rounded-md bg-slate-700">
      <div className="flex gap-3 p-2">
        <select
          onChange={({ target: { value } }) => setMethod(value)}
          className="border-slate-600 border-2 p-2 rounded-md bg-slate-700"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select
          onChange={({ target: { value } }) => setSelectedPath(value)}
          className="border-slate-600 border-2 p-2 rounded-md bg-slate-700"
        >
          {paths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
        >
          Send {method}
        </button>
      </div>
      <div className="p-2">
        <Editor
          disabled={method === "GET"}
          setContents={setInput}
          initialContents={input}
          language="rust"
        />
      </div>
      <code className="p-2 font-mono text-sm">{output}</code>
    </div>
  );
};

export default HTTPRepl;
