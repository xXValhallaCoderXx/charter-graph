/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useFlowData } from "@/shared/hooks/useFlowGraphData";
import { useSearchParams, useRouter } from "next/navigation";
import { getLayoutedNodes } from "@/shared/lib/dagre-layout";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";

const GraphPanel = () => {
  const params = useSearchParams();
  const router = useRouter();
  const rootId = params.get("rootId") ?? undefined;

  const { data, isLoading, error } = useFlowData(rootId);

  console.log("GraphPanel", data);

  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges || []);

  useEffect(() => {
    if (!data) return;

    const layoutedNodes = getLayoutedNodes(data.nodes, data.edges);
    setNodes(layoutedNodes);
    setEdges(data.edges);
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  if (isLoading) return <div>Loading graph…</div>;
  if (error) return <div>Error loading graph: {error.message}</div>;

  return (
    <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        onNodeClick={(e: any, node: any) => {
          router.push(`/?rootId=${rootId ?? ""}&selectedId=${node.id}`);
        }}
        onNodeDoubleClick={(e: any, node: any) => {
          // re-root the graph and open the sidebar on that node
          router.replace(`/?rootId=${node.id}&selectedId=${node.id}`);
        }}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        <Panel
          position="top-right"
          className="bg-white p-4 rounded-md shadow-md"
        >
          Add Node
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default GraphPanel;
