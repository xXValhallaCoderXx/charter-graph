"use client";
import { useCreateChildSystem } from "@/shared/hooks/useSystemApi";

import { Button } from "@/shared/components/molecues";
import { Input } from "@/shared/components/atoms";

interface IAddSystemFormProps {
  systemId: string;
}

const AddSystemForm = ({ systemId }: IAddSystemFormProps) => {
  const createChildM = useCreateChildSystem(systemId);

  const handleAddChild = (childName: string) => {
    if (childName.trim()) {
      createChildM.mutate(childName.trim());
    }
  };

  return (
    <>
      <Input
        placeholder="Enter a new system name"
        disabled={createChildM?.isPending || !systemId}
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
          disabled={createChildM?.isPending || !systemId}
          onClick={() => {
            const input = document.querySelector(
              'input[placeholder="Enter a new system name"]'
            ) as HTMLInputElement;
            handleAddChild(input.value.trim());
            input.value = "";
          }}
        />
      </div>
    </>
  );
};

export default AddSystemForm;
