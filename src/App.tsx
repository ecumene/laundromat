import { useEffect, useState } from "react";
import { FaCube, FaGamepad } from "react-icons/fa";
import { Link, Route } from "wouter";
import HTTPEditor from "./repl/HTTP";
import getManifest, { SpinComponent, SpinToml } from "./spin.toml";
import useLogs from "./useLogs";

type SidebarItemProps = {
  title?: boolean;
  component?: boolean;
  name: string;
  icon?: React.ElementType;
  path: string;
};

function SidebarItem({
  name,
  title,
  component,
  icon: Icon,
  path,
}: SidebarItemProps) {
  return (
    <li>
      <Link
        href={path}
        className={`${
          title && "text-xl font-bold"
        } flex text-white items-center p-2 font-normal overflow-hidden text-gray-900 rounded-lg hover:bg-gray-600`}
      >
        <div>
          {Icon && (
            <Icon className={component ? "text-amber-400" : "text-white"} />
          )}
        </div>
        <span
          className={`${!title && "ml-3"} ${
            component ? "text-amber-400" : "text-white"
          }  flex-1 overflow-auto whitespace-nowrap`}
        >
          {name}
        </span>
      </Link>
    </li>
  );
}

type LogViewerProps = {
  logs: string[];
};

function LogViewer({ logs }: LogViewerProps) {
  return (
    <div className="flex flex-col border-slate-100 border rounded-md bg-slate-700">
      {logs.map((log, i) => (
        <div className="border-b border-slate-600 p-2" key={i}>
          {log}
        </div>
      ))}
    </div>
  );
}

function Components({
  manifest,
  component,
}: {
  manifest: SpinToml;
  component?: SpinComponent;
}): JSX.Element {
  if (!component) {
    return <div>No component selected</div>;
  }
  const logs = useLogs(manifest.name, component.id);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-slate-600 p-2">
        <div className="flex text-xl flex-row items-center">
          <InlineCode>id: {component.id}</InlineCode>
        </div>
        <LogViewer logs={logs} />
      </div>
    </div>
  );
}

function InlineCode({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${className} font-mono  p-1 rounded font-bold bg-slate-700 text-amber-300`}
    >
      {children}
    </div>
  );
}

function App() {
  const [manifest, setManifest] = useState<SpinToml>();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const spinToml = await getManifest();
      if (isMounted) {
        setManifest(spinToml);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!manifest) {
    return (
      <svg
        role="status"
        className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  }

  return (
    <div className="flex text-white m-auto rounded-md min-h-[100px] bg-slate-900">
      <aside className="w-60 bg-slate-700 rounded-l-md" aria-label="Sidebar">
        <div className="overflow-auto py-4 px-3 border-solid border-r border-slate-300">
          <ul className="space-y-2">
            <SidebarItem title name="👕🧦laundromat!" path="/" />
            <SidebarItem icon={FaGamepad} name="Play" path="/" />
            {manifest.component.map((component, i) => (
              <SidebarItem
                component
                key={i}
                icon={FaCube}
                name={component.id}
                path={`/component/${component.id}`}
              />
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="flex border-b border-grey-200 pb-3 m-2 gap-4">
          <div className="flex gap-2 items-center">
            name
            <InlineCode>{manifest.name}</InlineCode>
          </div>
          <div className="flex gap-2 items-center">
            trigger
            <InlineCode>
              {manifest.trigger.type}: {manifest.trigger.base}
            </InlineCode>
          </div>
          <div className="flex gap-2 items-center">
            version
            <InlineCode>{manifest.version}</InlineCode>
          </div>
        </div>

        <Route path="/">
          <HTTPEditor
            paths={manifest.component.map(({ trigger: { route } }) => route)}
          />
        </Route>
        <Route path="/component/:id">
          {(params) => (
            <Components
              manifest={manifest}
              component={manifest.component.find(({ id }) => params.id === id)}
            />
          )}
        </Route>
      </div>
    </div>
  );
}

export default App;
