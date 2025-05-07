import { FC, useState, useEffect } from "react";
import {
  IconPencil,
  IconTrash,
  IconCheck,
  IconCancel,
} from "@tabler/icons-react";
import { Input, ActionIcon } from "@/shared/components/atoms";
import { System } from "@/shared/slices/system/system.types";

interface IChildSystemListProps {
  onClickChildSystem: (childId: string) => void;
  child: System;
  isLoading: boolean;
  onClickRemove: (childId: string) => void;
}

const ChildSystemItem: FC<IChildSystemListProps> = ({
  onClickChildSystem,
  child,
  isLoading,
  onClickRemove,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(child.name);
  const [cat, setCat] = useState(child.category);
  console.log("child", child);
  useEffect(() => {
    setName(child.name);
    setCat(child.category);
  }, [child]);

  const handleOnClickChildSystem = () => () => {
    onClickChildSystem(child?.id);
  };
  const handleOnClickRemove = () => {
    onClickRemove(child?.id);
  };

  if (isEditing) {
    return (
      <li className="p-2 bg-gray-50 rounded flex flex-col gap-2">
        <div className="flex gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <ActionIcon size="lg" rounded={false} variant="transparent">
              <IconCheck
                color="green"
                onClick={() => {
                  //   onUpdate(child.id, { name, category: cat });
                  setEditing(false);
                }}
              />
            </ActionIcon>
            <ActionIcon size="lg" rounded={false} variant="transparent">
              <IconCancel
                color="red"
                onClick={() => {
                  setEditing(false);
                }}
              />
            </ActionIcon>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li key={child.id} className="flex justify-between items-center">
      <span
        onClick={handleOnClickChildSystem}
        className="text-primary-600 hover:underline cursor-pointer"
      >
        {child.name}
      </span>
      <div className="flex items-center gap-2">
        <ActionIcon rounded={false} variant="transparent">
          <IconPencil
            color="gray"
            onClick={() => {
              setEditing(true);
            }}
          />
        </ActionIcon>
        <ActionIcon rounded={false} variant="transparent">
          <IconTrash color="red" onClick={handleOnClickRemove} />
        </ActionIcon>
      </div>
    </li>
  );
};

export default ChildSystemItem;
