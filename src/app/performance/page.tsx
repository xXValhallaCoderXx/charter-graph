/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
// import { fetchGraph } from "@/shared/slices/system/system.service";
import { ReactFlow } from "@xyflow/react";
import useGraphLayoutWorker from "@/shared/hooks/useGraphLayoutWorker";
import { useGetGraphData } from "@/shared/hooks/useGetGraphData";
const PerformancePage = () => {
  const { data } = useGetGraphData();
  // @ts-ignore
  const { nodes, edges } = useGraphLayoutWorker(
    data?.nodes ?? [],
    data?.edges ?? []
  );

  return (
    <div>
      <ReactFlow nodes={nodes} edges={edges} />
      heh
    </div>
  );
};

export default PerformancePage;
