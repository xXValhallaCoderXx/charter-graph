/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { EWorkerMessageType } from "../lib/graph.worker";

const useGraphWorker = ({ nodes, edges }: any) => {
  //   const [layout, setLayout] = useState(null);
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/shared/lib/graph.worker.ts", import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({
      id: EWorkerMessageType.INIT,
      payload: { nodes, edges },
    });
    workerRef.current.onmessage = (e) => {
      if (e.data.id === EWorkerMessageType.INIT_COMPLETE) {
        console.log("HOOK - INIT_COMPLETE");
      }
    };
  }, [nodes, edges]);

  return {
    x: "",
  };
};

export default useGraphWorker;
