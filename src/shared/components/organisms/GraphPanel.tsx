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
  applyNodeChanges,
  NodeChange,
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
  const posRef = useRef<Map<string, any>>(new Map());
  const isFirstLayout = useRef(true);
  const selectedId = params.get("selectedId") ?? undefined;

  const { data, isLoading, error } = useFlowData(rootId);
  const createInterfaceM = useCreateInterface();
  const [nodes, setNodesInternal] = useNodesState(data?.nodes || []);
  const [edges, setEdgesInternal, onEdgesChange] = useEdgesState(
    data?.edges || []
  );

  // Not sure why but had to manually hook into node change
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodesInternal((nds) => {
        const updated = applyNodeChanges(changes, nds);
        updated.forEach((n) => {
          posRef.current.set(n.id, n.position);
        });
        return updated;
      });
    },
    [setNodesInternal]
  );

  useEffect(() => {
    if (!data) return;

    // Compute a fresh Dagre layout
    const { nodes: layoutNodes, edges: layoutEdges } = getLayoutedNodes(
      data.nodes,
      data.edges,
      selectedId
    );
    setEdgesInternal(layoutEdges);

    if (isFirstLayout.current) {
      // very first time: stash
      layoutNodes.forEach((n) => {
        posRef.current.set(n.id, n.position);
      });
      setNodesInternal(layoutNodes);
      isFirstLayout.current = false;
    } else {
      // For each node in this view, pick up our cached position if we have one
      setNodesInternal(
        layoutNodes.map((n) => ({
          ...n,
          position: posRef.current.get(n.id) ?? n.position,
        }))
      );
    }
  }, [data, selectedId, setNodesInternal, setEdgesInternal]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdgesInternal((eds) => addEdge(connection, eds));
      createInterfaceM.mutate({
        system_a_id: connection.source,
        system_b_id: connection.target,
        connection_type: "default",
        directional: false,
      });
    },
    [setEdgesInternal, createInterfaceM]
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
