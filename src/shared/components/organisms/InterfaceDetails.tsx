"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useFetchInterfaces,
  useCreateInterface,
  useUpdateInterface,
  useDeleteInterface,
} from "@/shared/hooks/useInterfaceApi";
import { SystemInterface } from "@/shared/slices/interface/interface.types";

const InterfaceDetails = () => {
  const params = useSearchParams();

  const rootId = params.get("rootId") ?? undefined;

  const { data: ifaces = [] } = useFetchInterfaces(rootId);
  const createM = useCreateInterface(rootId);
  const updateM = useUpdateInterface(rootId);
  const deleteM = useDeleteInterface(rootId);

  const [newType, setNewType] = useState("");
  const [newOther, setNewOther] = useState("");
  const [newDirectional, setNewDirectional] = useState(false);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Interfaces</h3>
      <ul className="space-y-2">
        {ifaces.map((iface: SystemInterface) => (
          <li key={iface.id} className="flex justify-between items-center">
            <div>
              <strong>{iface.connection_type}</strong> (&nbsp;
              {iface.directional ? "One-way" : "Bi-directional"} )
            </div>
            <div className="flex gap-2">
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  const newType = prompt(
                    "Connection type",
                    iface.connection_type
                  );
                  if (newType)
                    updateM.mutate({ id: iface.id, connection_type: newType });
                }}
              >
                Edit
              </button>
              <button
                className="text-sm text-red-500"
                onClick={() => deleteM.mutate(iface.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t pt-4 space-y-2">
        <h4 className="font-medium">Add New Interface</h4>
        <input
          placeholder="Connection type"
          className="block w-full border rounded p-1"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
        <input
          placeholder="Other system ID"
          className="block w-full border rounded p-1"
          value={newOther}
          onChange={(e) => setNewOther(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newDirectional}
            onChange={(e) => setNewDirectional(e.target.checked)}
          />
          One-way?
        </label>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => {
            createM.mutate({
              system_a_id: rootId!,
              system_b_id: newOther,
              connection_type: newType,
              directional: newDirectional,
            });
            setNewType("");
            setNewOther("");
            setNewDirectional(false);
          }}
        >
          Add Interface
        </button>
      </div>
    </div>
  );
};
export default InterfaceDetails;
