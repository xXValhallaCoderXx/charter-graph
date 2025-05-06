"use client";
import { useFlowData } from "@/shared/hooks/useFlowGraphData";
import { useSearchParams } from "next/navigation";
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

  const rootId = params.get("rootId") ?? undefined;

  const { data, isLoading, error } = useFlowData(rootId);

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
    <div style={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
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
