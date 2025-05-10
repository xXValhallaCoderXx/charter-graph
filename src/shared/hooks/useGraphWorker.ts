/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

const useGraphWorker = (rawTopology: any) => {
  const [layout, setLayout] = useState(null);
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/shared/lib/dagre-layout.worker.ts", import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ id: "layout", payload: rawTopology });
    workerRef.current.onmessage = (e) => {
      if (e.data.id === "layout") setLayout(e.data.payload);
    };
  }, [rawTopology]);

  return layout;
};

export default useGraphWorker;
