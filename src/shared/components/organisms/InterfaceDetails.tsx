/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo } from "react";
import {
  useFetchInterfaces,
  useCreateInterface,
  useUpdateInterface,
  useDeleteInterface,
} from "@/shared/hooks/useInterfaceApi";
import { useSearchParams } from "next/navigation";
import { Button, Select } from "@/shared/components/molecues";
import { Typography, Input, Skeleton } from "@/shared/components/atoms";
import { SystemInterface } from "@/shared/slices/interface/interface.types";
import { useFlowData } from "@/shared/hooks/useFlowGraphData";



const InterfaceDetails = () => {
  const params = useSearchParams();
  const systemId = params.get("selectedId") ?? "";
  const { data: graph } = useFlowData(systemId);

  const { data: ifaces = [], isLoading } = useFetchInterfaces(systemId);
  const createM = useCreateInterface(systemId);
  const updateM = useUpdateInterface(systemId);
  const deleteM = useDeleteInterface(systemId);

  const [newType, setNewType] = useState("");
  const [newOther, setNewOther] = useState("");
  const [newDirectional, setNewDirectional] = useState(false);

  const systemOptions = useMemo(() => {
    if (!graph) return [];
    return graph.nodes.map((node) => ({
      value: node.id,
      label: (node.data as any).label,
    }));
  }, [graph]);

  console.log("System Options", systemOptions);

  return (
    <div className="flex flex-col h-full  overflow-hidden px-1">
      {/* ── Scrollable List Area ── */}
      <div className="py-1 border-b">
        <Typography variant="h3" fw="semibold">
          Interfaces ({ifaces?.length || 0})
        </Typography>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 mt-2">
        {!systemId && (
          <div className="h-full flex items-center justify-center">
            <Typography variant="body" fw="normal">
              Select a system to view interfaces
            </Typography>
          </div>
        )}

        {systemId && !isLoading && ifaces.length === 0 && (
          <div className="text-neutral-500">No interfaces found</div>
        )}

        {/* Loading state */}
        {/* {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        )} */}

        {!isLoading && ifaces.length > 0 && (
          <ul className="space-y-2">
            {ifaces.map((iface: SystemInterface) => (
              <li key={iface.id} className="flex justify-between items-center">
                <div>
                  <strong className="text-neutral-800">
                    {iface.connection_type}
                  </strong>{" "}
                  ({iface.directional ? "One-way" : "Bi-directional"})
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-primary-600 hover:underline text-sm"
                    onClick={() => {
                      const updated = prompt(
                        "Connection type",
                        iface.connection_type
                      );
                      if (updated) {
                        updateM.mutate({
                          id: iface.id,
                          connection_type: updated,
                        });
                      }
                    }}
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
            ))}
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 border-t pt-3">
        <Typography variant="body" fw="semibold" className="mb-2">
          Add New Interface
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <Typography as="span" size="sm" fw="semibold">
              Connection Type
            </Typography>
            <Skeleton isLoading={isLoading}>
              <Input
                disabled={!systemId}
                placeholder="e.g. REST"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="mt-1"
              />
            </Skeleton>
          </label>

          <label className="block">
            <Typography as="span" size="sm" fw="semibold">
              Other System ID (Optional)
            </Typography>
            <Skeleton isLoading={isLoading}>
              <Select
                onChange={(e) => setNewOther(e.target.value)}
                value={newOther}
                disabled={!systemId}
                className="mt-1 w-full"
                options={systemOptions}
              />
            </Skeleton>
          </label>
        </div>
        <div className="flex justify-between ">
          <div className="flex items-center justify-between gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={newDirectional}
              onChange={(e) => setNewDirectional(e.target.checked)}
              disabled={!systemId}
              id="directional-toggle"
            />
            <label htmlFor="directional-toggle" className="text-sm">
              One-way?
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              label="Add Interface"
              disabled={!systemId || createM.isPending}
              onClick={() => {
                createM.mutate({
                  system_a_id: systemId!,
                  system_b_id: newOther,
                  connection_type: newType,
                  directional: newDirectional,
                });
                setNewType("");
                setNewOther("");
                setNewDirectional(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InterfaceDetails;
