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
 
  const { data: system, isLoading: loadingSys } = useFetchSystem(systemId);
  const { data: children = [], isLoading: isLoadingDescendants } =
    useFetchDescendants(systemId);

  const updateSystemM = useUpdateSystem(systemId);
  const createChildM = useCreateChildSystem(systemId);
  const removeChildM = useRemoveChildSystem(systemId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    if (system) {
      setName(system.name);
      setCategory(system.category);
    }
  }, [system]);

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
  };

  const handleAddChild = (childName: string) => {
    if (childName.trim()) {
      createChildM.mutate(childName.trim());
    }
  };

  const onClickChildSystem = (childId: string) => () => {
    router.replace(`/?rootId=${childId}&selectedId=${childId}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden ">
      <div className=" py-1 pb-1 border-b">
        <Typography variant="h3" fw="semibold">
          System Details
        </Typography>
      </div>
      <div className="  flex flex-col md:flex-row gap-4 mt-4">
        <label className="flex-1">
          <Typography as="span" size="sm" fw="semibold">
            Name
          </Typography>
          <Skeleton isLoading={loadingSys || isLoadingDescendants}>
            <Input
              value={systemId ? name : ""}
              disabled={!systemId}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              className="mt-1"
            />
          </Skeleton>
        </label>

        <label className="flex-1">
          <Typography as="span" size="sm" fw="semibold">
            Category
          </Typography>
          <Skeleton isLoading={loadingSys || isLoadingDescendants}>
            <Input
              value={systemId ? category : ""}
              disabled={!systemId}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={handleCategoryBlur}
              className="mt-1 capitalize"
            />
          </Skeleton>
        </label>

        <div className="flex items-end">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className=" pt-3">
          <Typography variant="body" fw="semibold">
            Child systems ({children.length})
          </Typography>
        </div>
        <ul className="pl-4 pr-2 pt-2 overflow-y-auto space-y-2 flex-1">
          {children.map((child: System) => (
            <li key={child.id} className="flex justify-between items-center">
              <span
                onClick={onClickChildSystem(child.id)}
                className="text-primary-600 hover:underline cursor-pointer"
              >
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

        <div className="sticky bottom-0 bg-white pt-4 flex gap-2">
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
          <div className="w-40">
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
