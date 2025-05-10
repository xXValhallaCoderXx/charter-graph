/* eslint-disable @typescript-eslint/no-explicit-any */
// import dagre from "dagre";
// import {
//   normalizeGraph,
//   applyDagreLayout,
// } from "../slices/graph/graph.services";

export enum EWorkerMessageType {
  INIT = "INIT",
  INIT_COMPLETE = "INIT_COMPLETE",
  LAYOUT = "LAYOUT",
  LAYOUT_COMPLETE = "LAYOUT_COMPLETE",
}

console.log("LALALALA");
self.onmessage = function (event: MessageEvent) {
  const { type, payload } = event.data;

  if (type === EWorkerMessageType.INIT) {
    console.log("PROCESSING INIT", payload);
    // 1) Normalize
    // const { nodes, edges } = normalizeGraph(
    //   payload.nodes ,
    //   payload.edges
    // );
    // 2) Send back to main thread
    // self.postMessage({ type: "NORMALIZED", payload: { nodes, edges } });
  }

  if (type === EWorkerMessageType.LAYOUT) {
    console.log("PROCESSING LAYOUT", payload);
    // payload should be the normalized { nodes, edges }
    // const { nodes, edges } = applyDagreLayout(
    //   payload.nodes ,
    //   payload.edges
    // );
    // self.postMessage({ type: "LAYOUT_COMPLETE", payload: { nodes, edges } });
  }
};
