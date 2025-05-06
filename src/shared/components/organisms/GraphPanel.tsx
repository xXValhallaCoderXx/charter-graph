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
import { useCallback, useEffect, useRef } from "react";

const GraphPanel = () => {
  const params = useSearchParams();
  const router = useRouter();
  const isMounted = useRef(false);
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
  if (isLoading && !isMounted) return <div>Loading graph…</div>;
  if (error) return <div>Error loading graph: {error.message}</div>;
  isMounted.current = true;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        onNodeClick={(e: any, node: any) => {
          router.replace(`/?rootId=${rootId ?? ""}&selectedId=${node.id}`);
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
          {rootId ? (
            <button
              onClick={() => {
                // clear rootId & selectedId → go back to full graph
                router.replace("/");
              }}
              className="text-blue-600 hover:underline"
            >
              ← Back to Root
            </button>
          ) : (
            <span className="font-medium">Full Graph</span>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default GraphPanel;
