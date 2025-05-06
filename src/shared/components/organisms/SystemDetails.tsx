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
import {
  Skeleton,
  Typography,
  Input,
  ActionIcon,
} from "@/shared/components/atoms";
import { IconTrash } from "@tabler/icons-react";

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
    <div className="h-[100%]">
      <div className="flex flex-col md:flex-row gap-4 mb-4  ">
        <label className="block w-full md:w-1/2">
          <Typography as="span" size="sm" fw="semibold">
            Name
          </Typography>
          <Skeleton isLoading={loadingSys || isLoadingDescendants}>
            <Input
              value={name}
              disabled={!systemId}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
            />
          </Skeleton>
        </label>

        <label className="block w-full md:w-1/2">
          <Typography as="span" size="sm" fw="semibold">
            Category
          </Typography>
          <Skeleton isLoading={loadingSys || isLoadingDescendants}>
            <Input
              value={category}
              disabled={!systemId}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={handleCategoryBlur}
            />
          </Skeleton>
        </label>
        <div className="flex   items-end">
          <ActionIcon
            size="lg"
            onClick={handleDelete}
            disabled={loadingSys || isLoadingDescendants || !systemId}
            variant="outline"
            rounded={false}
          >
            <IconTrash color="red" />
          </ActionIcon>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col h-full ">
        <Typography variant="body" fw="semibold">
          Child systems ({children.length})
        </Typography>
        <div className="flex-1 overflow-y-auto mb-4 pr-1 min-h-[80px] max-h-[21vh]">
          <ul className="flex flex-col gap-1">
            {children.map((child: System) => (
              <li key={child.id} className="flex justify-between py-1">
                <span className="text-blue-600 cursor-pointer">
                  {child.name}
                </span>
                <Button
                  size="xs"
                  variant="outline"
                  label="Remove"
                  onClick={() => removeChildM.mutate(child.id)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter a new system name"
            disabled={loadingSys || isLoadingDescendants || !systemId}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddChild((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
          <div className="w-[180px] ">
            <Button
              label="Add System"
              disabled={loadingSys || isLoadingDescendants || !systemId}
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="Enter a new system name"]'
                ) as HTMLInputElement;
                handleAddChild(input.value.trim());
                input.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SystemDetails;
