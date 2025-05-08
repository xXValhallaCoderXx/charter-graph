"use client";
import {
  useFetchDescendants,
  useFetchCategories,
} from "@/shared/hooks/useSystemApi";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useRemoveChildSystem,
  useLazyUpdateSystem,
} from "@/shared/hooks/useSystemApi";
import { FC } from "react";
import { System } from "@/shared/slices/system/system.types";
import ChildSystemItem from "./components/ChildSystemItem";
import { Typography } from "@/shared/components/atoms";
import SystemDetail from "./components/SystemDetail";
import AddSystemForm from "./components/AddSystemForm";

const SystemSection: FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const systemId = params.get("selectedId") ?? "";

  const { data: categories = [] } = useFetchCategories();

  const { data: children = [], isLoading: isLoadingDescendants } =
    useFetchDescendants(systemId);

  const removeChildM = useRemoveChildSystem(systemId);
  const updateSystem = useLazyUpdateSystem();

  const handleNavigateToChildSystem = (childId: string) => () => {
    router.replace(`/?rootId=${childId}&selectedId=${childId}`);
  };

  const handleUpdateSystem = (id: string, data: Partial<System>) => {
    updateSystem.mutate(
      { id, data },
      {
        onSuccess: () => toast.success("System updated successfully"),
        onError: () => toast.error("Failed to update system"),
      }
    );
  };

  const handleRemoveChildSystem = (childId: string) => {
    removeChildM.mutate(childId, {
      onSuccess: () => {
        toast.success("System removed successfully");
      },
      onError: () => {
        toast.error("Failed to remove system");
      },
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden ">
      <div className=" py-1 pb-1 border-b">
        <Typography variant="h3" fw="semibold">
          System Details
        </Typography>
      </div>
      <SystemDetail
        systemId={systemId}
        onClickRemoveSystem={handleRemoveChildSystem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className=" pt-3">
          <Typography variant="body" fw="semibold">
            Child systems ({children.length})
          </Typography>
        </div>
        <ul className="overflow-y-auto flex-1 space-y-2 mt-2 px-2">
          {children.map((child: System) => (
            <ChildSystemItem
              key={child.id}
              categories={categories}
              child={child}
              isLoading={isLoadingDescendants}
              onClickChildSystem={handleNavigateToChildSystem}
              onClickRemove={handleRemoveChildSystem}
              onClickUpdate={handleUpdateSystem}
            />
          ))}
        </ul>

        <div className="sticky bottom-0 bg-white pt-4 flex gap-2">
          <AddSystemForm systemId={systemId} />
        </div>
      </div>
    </div>
  );
};
export default SystemSection;
