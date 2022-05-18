import { useEffect, useState } from "react";
import Editor from "./Editor";

type Props = {
  paths: string[];
};

const Response = ({ response }: { response: Response }) => {
  const [text, setText] = useState<string | null>(null);
  const { headers, status, statusText, url } = response;
  const isOk = response.ok;

  useEffect(() => {
    if (!response.bodyUsed) {
      (async () => {
        const blob = await response.blob();

        try {
          const text = await blob?.text();
          if (text[0] === "{") {
            setText(JSON.stringify(JSON.parse(text), null, 2));
          } else {
            setText(text ?? null);
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  return (
    <div className="p-4 font-mono rounded-lg bg-slate-900 m-2">
      <h2 className="text-2xl font-bold">
        {status} {statusText} {isOk ? "😄" : "😱"}
      </h2>
      <div className="text-sm">{url}</div>

      <div className="my-4">
        {[...headers.entries()].map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </div>
      <div>{text}</div>
    </div>
  );
};

const HTTPRepl = ({ paths }: Props) => {
  const [output, setOutput] = useState<Response | null>(null);
  const [input, setInput] = useState("{}");
  const [selectedPath, setSelectedPath] = useState(paths[0]);
  const [method, setMethod] = useState("GET");
  // todo
  // const [headers, setHeaders] = useState<Record<string, string>>({});
  const [path, setPath] = useState<string>("");

  const handleSubmit = async () => {
    setOutput(null);
    const strippedPath = selectedPath.replace(/\.\.\./, "");
    const response = await fetch(`/proxy${strippedPath}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? JSON.stringify(input) : undefined,
    });

    setOutput(response);
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
        {selectedPath.endsWith("...") && (
          <>
            <div className="font-bold flex items-center">Path</div>
            <input
              value={path}
              onChange={({ target: { value } }) => setPath(value)}
              className="font-mono text-lg border-slate-600 border-2 px-2 rounded-md bg-slate-700"
            />
          </>
        )}
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
      {output && <Response response={output} />}
    </div>
  );
};

export default HTTPRepl;
