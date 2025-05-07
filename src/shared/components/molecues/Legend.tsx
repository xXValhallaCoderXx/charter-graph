/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Legend.tsx
import type { Node } from "@xyflow/react";

interface LegendProps {
  nodes: Node[];
}

function Legend({ nodes }: LegendProps) {
  // build a map: type -> color
  const map = new Map<string, string>();
  for (const node of nodes) {
    const type = (node.data as any).type as string;
    const color = (node.style as any)?.background as string;
    if (type && color && !map.has(type)) {
      map.set(type, color);
    }
  }

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      {[...map.entries()].map(([type, color]) => (
        <div key={type} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded" style={{ background: color }} />
          <span className="text-sm font-medium">{type}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;
