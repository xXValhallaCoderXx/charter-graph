/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FC, useMemo, useState } from "react";
import {
  useUpdateInterface,
  useDeleteInterface,
} from "@/shared/hooks/useInterfaceApi";
import { IconCheck, IconCancel } from "@tabler/icons-react";
import { Typography, Input, ActionIcon } from "@/shared/components/atoms";
import { Select } from "@/shared/components/molecues";
import { SystemInterface } from "@/shared/slices/interface/interface.types";

type Option = { value: string; label: string };

interface Node {
  id: string;
  data: { label: string; [k: string]: any };
  // ...you only really need `id` and `data.label`
}
interface Edge {
  source: string;
  target: string;
  // ...you only need those two to detect existing connections
}

export function buildAvailableInterfaceOptions(
  nodes: Node[],
  edges: Edge[]
): Option[] {
  if (!nodes || !edges) return [];
  // 1) Build a Set of existing undirected pairs
  const taken = new Set<string>();
  for (const { source, target } of edges) {
    // sort so "A-B" and "B-A" map to the same key
    const [a, b] = source < target ? [source, target] : [target, source];
    taken.add(`${a}—${b}`);
  }

  // 2) For each unordered pair of nodes, if it’s not in `taken`, add an Option
  const options: Option[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i],
        b = nodes[j],
        key = `${a.id}—${b.id}`;

      if (!taken.has(key)) {
        options.push({
          value: a.id,
          label: `${a.data.label} ↔ ${b.data.label}`,
        });
      }
    }
  }
  return options;
}

interface IIinterfaceListProps {
  systemId: string;
  ifaces: SystemInterface[];
  graph: any;
  options: any;
}

const InterfaceList: FC<IIinterfaceListProps> = ({
  systemId,
  graph,
  ifaces,
  options = [],
}) => {
  const updateM = useUpdateInterface(systemId);
  const deleteM = useDeleteInterface(systemId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState("");
  const [editOther, setEditOther] = useState("");
  const [editDirectional, setEditDirectional] = useState(false);

  const nameById = useMemo(() => {
    if (!graph) return new Map<string, string>();
    return new Map(
      // @ts-ignore
      graph.nodes.map((node) => [node.id, (node.data as any).label as string])
    );
  }, [graph]);

  function startEdit(iface: SystemInterface) {
    setEditingId(iface.id.toString());
    setEditType(iface.connection_type);
    setEditOther(iface.system_b_id.toString());
    setEditDirectional(iface.directional);
  }

  // helper to cancel
  function cancelEdit() {
    setEditingId(null);
  }
  return (
    <ul className="space-y-2">
      {ifaces.map((iface: SystemInterface) => {
        const idStr = iface.id.toString();
        // if this row is in edit mode:
        if (editingId === idStr) {
          return (
            <li
              key={idStr}
              className="p-2 bg-gray-50 rounded flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Input
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  placeholder="Connection Type"
                  className="w-full"
                />

                <Select
                  disabled={!systemId}
                  options={options}
                  value={editOther}
                  className="w-full"
                  onChange={(e) => setEditOther(e?.target?.value)}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editDirectional}
                    onChange={(e) => setEditDirectional(e.target.checked)}
                  />
                  One‑way?
                </label>
                <div className="flex items-center gap-1">
                  <ActionIcon rounded={false} variant="transparent">
                    <IconCheck
                      color="green"
                      onClick={() => {
                        updateM.mutate({
                          id: iface.id,
                          connection_type: editType,
                          system_b_id: editOther,
                          directional: editDirectional,
                        });
                        setEditingId(null);
                      }}
                    />
                  </ActionIcon>
                  <ActionIcon
                    rounded={false}
                    variant="transparent"
                    onClick={cancelEdit}
                  >
                    <IconCancel color="red" />
                  </ActionIcon>
                </div>
              </div>
              {/* <div className="flex gap-2 justify-end">
                <Button
                  label="Save"
                  onClick={() => {
                    updateM.mutate({
                      id: iface.id,
                      connection_type: editType,
                      system_b_id: editOther,
                      directional: editDirectional,
                    });
                    setEditingId(null);
                  }}
                />
                <Button label="Cancel" variant="outline" onClick={cancelEdit} />
              </div> */}
            </li>
          );
        }

        const otherLabel =
          nameById.get(String(iface.system_b_id)) ?? "Unknown System";

        return (
          <li key={iface.id} className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2">
              <Typography variant="body" fw="semibold">
                {iface.connection_type}
              </Typography>
              <div className="text-sm text-neutral-600">
                → {otherLabel as string} (
                {iface.directional ? "One‑way" : "Bi‑directional"})
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="text-primary-600 hover:underline text-sm"
                onClick={() => startEdit(iface)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => deleteM.mutate(iface.id)}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default InterfaceList;
