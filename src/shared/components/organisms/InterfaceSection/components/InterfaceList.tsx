/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FC, useMemo, useState } from "react";
import {
  useUpdateInterface,
  useDeleteInterface,
} from "@/shared/hooks/useInterfaceApi";
import { toast } from "react-toastify";
import { IconCheck, IconCancel } from "@tabler/icons-react";
import { Typography, Input, ActionIcon } from "@/shared/components/atoms";
import { Select } from "@/shared/components/molecues";
import { SystemInterface } from "@/shared/slices/interface/interface.types";

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
      graph.nodes.map((node: any) => [
        node.id,
        (node.data as any).label as string,
      ])
    );
  }, [graph]);

  const startEdit = (iface: SystemInterface) => {
    setEditingId(iface.id.toString());
    setEditType(iface.connection_type);
    setEditOther(iface.system_b_id.toString());
    setEditDirectional(iface.directional);
  };

  const cancelEdit = () => setEditingId(null);

  const handleUpdateInterface = (id: string) => () => {
    updateM.mutate(
      {
        id,
        connection_type: editType,
        system_b_id: editOther,
        directional: editDirectional,
      },
      {
        onSuccess: () => {
          toast.success("Interface updated");
          cancelEdit();
        },
        onError: (err) => toast.error(`Update failed: ${err.message}`),
      }
    );
  };

  const handleDeleteInterface = (id: string) => () => {
    deleteM.mutate(id, {
      onSuccess: () => toast.success("Interface deleted"),
      onError: (err) => toast.error(`Delete failed: ${err.message}`),
    });
  };
  return (
    <ul className="space-y-2">
      {ifaces.map((iface: SystemInterface) => {
        const idStr = iface.id.toString();

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
                      onClick={handleUpdateInterface(iface.id.toString())}
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
                onClick={handleDeleteInterface(iface.id.toString())}
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
