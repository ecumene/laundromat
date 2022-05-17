import { useEffect, useState } from "react";

const getLogs = async (
  manifestID: string,
  componentID: string
): Promise<string[]> => {
  const response = await fetch(
    `/spin/${manifestID}/logs/${componentID}_stderr.txt`
  );
  const logs = await response.text();
  return logs.split("\n");
};

function useLogs(manifestID: string, componentID: string) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const logs = await getLogs(manifestID, componentID);
      if (isMounted) {
        setLogs(logs);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [componentID]);

  return logs;
}

export default useLogs;
