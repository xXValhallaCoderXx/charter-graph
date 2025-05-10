"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useGraphWorker from "@/shared/hooks/useGraphWorker";

// Initial nodes
const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Supabase Database" },
    position: { x: 250, y: 25 },
    style: {
      background: "#3ECF8E",
      color: "white",
      border: "1px solid #107969",
      borderRadius: "8px",
      padding: "10px",
      width: 180,
    },
  },
  {
    id: "2",
    data: { label: "Next.js API Routes" },
    position: { x: 250, y: 150 },
    style: {
      background: "#000000",
      color: "white",
      border: "1px solid #333",
      borderRadius: "8px",
      padding: "10px",
      width: 180,
    },
  },
  {
    id: "3",
    data: { label: "React Components" },
    position: { x: 250, y: 275 },
    style: {
      background: "#0070f3",
      color: "white",
      border: "1px solid #0050a3",
      borderRadius: "8px",
      padding: "10px",
      width: 180,
    },
  },
  {
    id: "4",
    type: "output",
    data: { label: "User Interface" },
    position: { x: 250, y: 400 },
    style: {
      background: "#6b21a8",
      color: "white",
      border: "1px solid #4a1072",
      borderRadius: "8px",
      padding: "10px",
      width: 180,
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#3ECF8E", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "#000000", strokeWidth: 2 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "#0070f3", strokeWidth: 2 },
  },
];

const ReactFlowWorker = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");

  const x = useGraphWorker({ nodes: [], edges: [] });

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add a new node to the diagram
  const addNode = useCallback(() => {
    if (!nodeName) return;

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: nodeName },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      style: {
        background: "#ff9900",
        color: "white",
        border: "1px solid #cc7a00",
        borderRadius: "8px",
        padding: "10px",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
  }, [nodeName, nodes.length, setNodes]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
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
          <h3 className="text-lg font-bold mb-2">Add Node</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Node name"
              className="px-2 py-1 border rounded"
            />
            <button
              onClick={addNode}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ReactFlowWorker;
