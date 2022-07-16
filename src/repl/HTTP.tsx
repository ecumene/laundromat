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

const HTTPHeaders = ({
  headers,
  setHeaders,
  onCreate,
}: {
  headers: [string, string][];
  setHeaders: React.Dispatch<React.SetStateAction<[string, string][]>>;
  onCreate: () => void;
}) => {
  return (
    <div className="my-4 mx-2 flex flex-col">
      <h3 className="text-xl font-bold flex gap-3">
        <div className="flex items-center">Request Headers</div>
        <button
          className="bg-slate-500 hover:bg-slate-800 text-sm text-white font-bold py-2 px-4 rounded"
          onClick={onCreate}
        >
          + Add Header
        </button>
      </h3>
      <div className="flex my-2 gap-2 flex-col">
        {headers.map(([key, value], i) => (
          <div className="flex gap-2">
            <input
              className="font-mono text-lg border-slate-600 border-2 px-2 rounded-md bg-slate-700"
              value={key}
              onChange={(e) => {
                headers[i][0] = e.target.value;
                setHeaders([...headers]);
              }}
            />
            <input
              className="font-mono text-lg border-slate-600 border-2 px-2 rounded-md bg-slate-700"
              value={value}
              onChange={(e) => {
                headers[i][1] = e.target.value;
                setHeaders([...headers]);
              }}
            />
            <button
              className="bg-slate-500 hover:bg-slate-800 text-white font-bold px-4 rounded"
              onClick={() =>
                setHeaders([...headers.slice(0, i), ...headers.slice(i + 1)])
              }
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const HTTPRepl = ({ paths }: Props) => {
  const [output, setOutput] = useState<Response | null>(null);
  const [input, setInput] = useState("{}");
  const [selectedPath, setSelectedPath] = useState(paths[0]);
  const [method, setMethod] = useState("GET");
  // todo
  const [headers, setHeaders] = useState<[string, string][]>([["Content-Type", "application/json"]]);
  const [path, setPath] = useState<string>("");

  const handleSubmit = async () => {
    setOutput(null);
    const strippedPath = selectedPath.replace(/\.\.\./, "");
    const response = await fetch(`/proxy${strippedPath}${path}`, {
      method,
      headers: Object.fromEntries(headers),
      body: method !== "GET" ? input : undefined,
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
      <HTTPHeaders
        onCreate={() => setHeaders((oldHeaders) => [...oldHeaders, ["", ""]])}
        headers={headers}
        setHeaders={setHeaders}
      />
      <div className="p-2">
        <Editor
          disabled={method === "GET"}
          setContents={setInput}
          initialContents={input}
          language="javascript"
        />
      </div>
      {output && <Response response={output} />}
    </div>
  );
};

export default HTTPRepl;
