"use client";
import { useFetchInterfaces2 } from "@/shared/hooks/useInterfaceApi";
import { useSearchParams } from "next/navigation";
import { Typography } from "@/shared/components/atoms";
import { useFlowData } from "@/shared/hooks/useFlowGraphData";
import AddInterfaceForm from "./components/AddInterfaceForm";
import InterfaceLoading from "./components/InterfaceLoading";
import InterfaceList from "./components/InterfaceList";
import { useFetchAllSystems } from "@/shared/hooks/useInterfaceApi";

const InterfaceDetails = () => {
  const params = useSearchParams();
  const systemId = params.get("selectedId") ?? "";
  const { data: graph } = useFlowData(systemId);
  const { data: allSystems = [] } = useFetchAllSystems();

  const { data: ifaces = [], isLoading } = useFetchInterfaces2(systemId);

  const connected = new Set<string>();
  ifaces.forEach((iface) => {
    if (String(iface.system_a_id) === systemId) {
      connected.add(String(iface.system_b_id));
    } else if (String(iface.system_b_id) === systemId) {
      connected.add(String(iface.system_a_id));
    }
  });

  const options = allSystems
    .filter((sys) => sys.id !== systemId)
    .filter((sys) => !connected.has(sys.id))
    .map((sys) => ({
      value: sys.id,
      label: sys.name,
    }));

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

        {isLoading && <InterfaceLoading />}

        {!isLoading && ifaces.length > 0 && (
          <InterfaceList
            systemId={systemId}
            ifaces={ifaces}
            graph={graph}
            options={options}
          />
        )}
      </div>

      <div className="sticky bottom-0 border-t pt-3">
        <AddInterfaceForm
          systemId={systemId}
          isLoading={isLoading}
          options={options}
        />
      </div>
    </div>
  );
};
export default InterfaceDetails;
