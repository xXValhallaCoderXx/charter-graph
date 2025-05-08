"use client";
import { useFetchSystem } from "@/shared/hooks/useSystemApi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Skeleton,
  Typography,
  Input,
  ActionIcon,
} from "@/shared/components/atoms";
import { System } from "@/shared/slices/system/system.types";
import {
  IconTrash,
  IconCheck,
  IconCancel,
  IconPencil,
} from "@tabler/icons-react";

interface ISystemDetailProps {
  systemId: string;
  onClickRemoveSystem: (systemId: string) => void;
  onClickUpdateSystem: (id: string, data: Partial<System>) => void;
}

const SystemDetail = ({
  systemId,
  onClickRemoveSystem,
  onClickUpdateSystem,
}: ISystemDetailProps) => {
  const router = useRouter();
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const { data: system, isLoading: loadingSys } = useFetchSystem(systemId);

  useEffect(() => {
    if (system) {
      setName(system.name);
      setCategory(system.category);
    }
  }, [system]);

  const handleSave = () => {
    if (!name.trim() || !category.trim()) return;
    onClickUpdateSystem(systemId, {
      name: name.trim(),
      category: category.trim(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(system?.name ?? "");
    setCategory(system?.category ?? "");
    setEditing(false);
  };

  const handleDelete = () => {
    onClickRemoveSystem(systemId);
    setCategory("");
    setName("");
    router.replace(`/`);
  };

  if (isEditing) {
    return (
      <div className="flex flex-row gap-4 mt-2 h-18 ">
        <label className="flex-1">
          <Typography as="span" size="sm" fw="semibold">
            Name
          </Typography>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-8"
            disabled={!systemId}
          />
        </label>

        <label className="flex-1">
          <Typography as="span" size="sm" fw="semibold">
            Category
          </Typography>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 capitalize h-8"
            disabled={!systemId}
          />
        </label>

        <div className="flex items-end gap-2 pb-2 pr-3">
          <ActionIcon
            variant="transparent"
            onClick={handleSave}
            rounded={false}
            disabled={!name.trim() || !category.trim()}
          >
            <IconCheck color="green" />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            onClick={handleCancel}
            rounded={false}
          >
            <IconCancel color="red" />
          </ActionIcon>
        </div>
      </div>
    );
  }

  return (
    <div className="  flex flex-row gap-4 pt-[3px] mt-2 h-18 ">
      <label className="flex-1 flex-col flex">
        <Typography as="span" size="sm" fw="semibold">
          Name
        </Typography>
        <Skeleton isLoading={loadingSys}>
          <Typography className="mt-1">{system?.name || "—"}</Typography>
        </Skeleton>
      </label>

      <label className="flex-1 flex-col flex">
        <Typography as="span" size="sm" fw="semibold">
          Category
        </Typography>
        <Skeleton isLoading={loadingSys}>
          <Typography className="mt-1 capitalize">
            {system?.category || "—"}
          </Typography>
        </Skeleton>
      </label>

      <div className="flex items-end pb-2 pr-2">
        <ActionIcon
          size="lg"
          onClick={() => setEditing(true)}
          disabled={loadingSys || !systemId}
          variant="transparent"
          rounded={false}
        >
          <IconPencil color="gray" />
        </ActionIcon>
        <ActionIcon
          size="lg"
          onClick={handleDelete}
          disabled={loadingSys || !systemId}
          variant="transparent"
          rounded={false}
        >
          <IconTrash color="red" />
        </ActionIcon>
      </div>
    </div>
  );
};

export default SystemDetail;
