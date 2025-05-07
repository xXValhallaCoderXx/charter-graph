/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Typography } from "@/shared/components/atoms";
import { useFlowData } from "@/shared/hooks/useFlowGraphData";
import { Legend } from "@/shared/components/molecues";
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
import { useCreateInterface } from "@/shared/hooks/useInterfaceApi";
import { IconArrowBack } from "@tabler/icons-react";
import { useCallback, useEffect, useRef } from "react";

const GraphPanel = () => {
  const params = useSearchParams();
  const router = useRouter();
  const isMounted = useRef(false);
  const rootId = params.get("rootId") ?? undefined;
  const selectedId = params.get("selectedId") ?? undefined;
  const prevRoot = useRef<string | undefined>(rootId);
  const { data, isLoading, error } = useFlowData(rootId);
  const createInterfaceM = useCreateInterface();
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges || []);

  useEffect(() => {
    if (!data) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedNodes(
      data.nodes,
      data.edges,
      selectedId
    );

    setEdges(layoutedEdges);

    // 3) Merge positions but use layoutedNodes instead of fullLayout
    setNodes((currentNodes) => {
      // if the root changed, just throw away all old positions
      if (prevRoot.current !== rootId) {
        prevRoot.current = rootId;
        return layoutedNodes;
      }

      // otherwise preserve the old positions for existing nodes
      const posMap = Object.fromEntries(
        currentNodes.map((n) => [n.id, n.position])
      );

      return layoutedNodes.map((n) => ({
        ...n,
        position: posMap[n.id] ?? n.position,
      }));
    });
  }, [data, rootId, selectedId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      createInterfaceM.mutate({
        system_a_id: params.source,
        system_b_id: params.target,
        connection_type: "dependency", // or open a dialog to pick type
        directional: false, // or decide based on a modifier key
      });
    },
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
              onClick={() => router.replace("/")}
              className="text-blue-600 hover:underline cursor-pointer flex items-center gap-2"
            >
              <IconArrowBack /> Back to Root
            </button>
          ) : (
            <Typography fw="semibold">Root Node</Typography>
          )}
        </Panel>
      </ReactFlow>
      <div className="absolute top-18 right-6">
        <Legend nodes={nodes} />
      </div>
    </div>
  );
};

export default GraphPanel;
