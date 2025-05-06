"use client";
import {
  useFetchSystem,
  useFetchDescendants,
  useRemoveChildSystem,
  useUpdateSystem,
  useCreateChildSystem,
} from "@/shared/hooks/useSystemApi";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";
import { Button } from "@/shared/components/molecues";
import { System } from "@/shared/slices/system/system.types";
import { Skeleton } from "@/shared/components/atoms";

interface ISystemDetailsProps {
  systemId: string;
}

const SystemDetails: FC<ISystemDetailsProps> = ({ systemId }) => {
  const router = useRouter();
  // Queries
  const { data: system, isLoading: loadingSys } = useFetchSystem(systemId);
  const { data: children = [], isLoading: isLoadingDescendants } =
    useFetchDescendants(systemId);

  // Mutations
  const updateSystemM = useUpdateSystem(systemId);
  const createChildM = useCreateChildSystem(systemId);
  const removeChildM = useRemoveChildSystem(systemId);

  // Local form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    if (system) {
      setName(system.name);
      setCategory(system.category);
    }
  }, [system]);

  // Handlers for onBlur and actions
  const handleNameBlur = () => {
    if (name !== system?.name) {
      updateSystemM.mutate({ name });
    }
  };

  const handleCategoryBlur = () => {
    if (category !== system?.category) {
      updateSystemM.mutate({ category });
    }
  };

  const handleDelete = () => {
    removeChildM.mutate(systemId);
    setCategory("");
    setName("");
    router.replace(`/`);
    // router.replace(`/?rootId=${system.parent_id}`, { shallow: true });
  };

  const handleAddChild = (childName: string) => {
    if (childName.trim()) {
      console.log("ADD CHILD");
      createChildM.mutate(childName.trim());
    }
  };

  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm">Name</span>
        <Skeleton isLoading={loadingSys || isLoadingDescendants}>
          <input
            className="mt-1 w-full border rounded p-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
          />
        </Skeleton>
      </label>

      <label className="block mb-4">
        <span className="text-sm">Category</span>
        <Skeleton isLoading={loadingSys || isLoadingDescendants}>
          <input
            className="mt-1 w-full border rounded p-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleCategoryBlur}
          />
        </Skeleton>
      </label>

      <Button
        disabled={loadingSys || isLoadingDescendants}
        onClick={handleDelete}
        label="Delete System"
      />

      <hr className="my-4" />

      <h3 className="font-medium mb-2">Child Systems</h3>
      <ul className="space-y-1 mb-4">
        {children.map((child: System) => (
          <li key={child.id} className="flex justify-between">
            <span className="text-blue-600 cursor-pointer">{child.name}</span>
            <Button
              size="small"
              variant="outline"
              label="Remove"
              onClick={() => removeChildM.mutate(child.id)}
            />
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          placeholder="New child name"
          disabled={loadingSys || isLoadingDescendants}
          className="flex-1 border rounded p-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddChild((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <Button
          label="AddSS"
          disabled={loadingSys || isLoadingDescendants}
          onClick={() => {
            const input = document.querySelector(
              'input[placeholder="New child name"]'
            ) as HTMLInputElement;
            handleAddChild(input.value.trim());
            input.value = "";
          }}
        />
      </div>
    </div>
  );
};
export default SystemDetails;
