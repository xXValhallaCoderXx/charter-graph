"use client";
import {
  useFetchSystem,
  useRemoveChildSystem,
  useUpdateSystem,
} from "@/shared/hooks/useSystemApi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Skeleton,
  Typography,
  Input,
  ActionIcon,
} from "@/shared/components/atoms";
import { IconTrash } from "@tabler/icons-react";

interface ISystemDetailProps {
  systemId: string;
}

const SystemDetail = ({ systemId }: ISystemDetailProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const { data: system, isLoading: loadingSys } = useFetchSystem(systemId);
  const removeChildM = useRemoveChildSystem(systemId);

  useEffect(() => {
    if (system) {
      setName(system.name);
      setCategory(system.category);
    }
  }, [system]);

  const updateSystemM = useUpdateSystem(systemId);

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

  return (
    <div className="  flex flex-col md:flex-row gap-4 mt-4">
      <label className="flex-1">
        <Typography as="span" size="sm" fw="semibold">
          Name
        </Typography>
        <Skeleton isLoading={loadingSys}>
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
        <Skeleton isLoading={loadingSys}>
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
          disabled={loadingSys || !systemId}
          variant="outline"
          rounded={false}
        >
          <IconTrash color="red" />
        </ActionIcon>
      </div>
    </div>
  );
};

export default SystemDetail;
