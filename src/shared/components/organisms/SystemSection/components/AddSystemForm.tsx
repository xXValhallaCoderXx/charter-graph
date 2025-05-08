"use client";
import { useCreateChildSystem } from "@/shared/hooks/useSystemApi";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/molecues";
import { Input } from "@/shared/components/atoms";
import { toast } from "react-toastify";

interface IAddSystemFormProps {
  systemId: string;
}

const AddSystemForm = ({ systemId }: IAddSystemFormProps) => {
  const [newName, setNewName] = useState("");
  const createChildM = useCreateChildSystem(systemId);

  useEffect(() => {
    setNewName("");
  }, [systemId]);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name || !systemId) return;

    createChildM.mutate(name, {
      onSuccess: () => {
        toast(`New child system added: ${name}`, {
          type: "success",
        });
        setNewName("");
      },
    });
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex items-center gap-2 px-1 w-full "
    >
      <Input
        placeholder="Enter a new system name"
        disabled={createChildM.isPending || !systemId}
        className="flex-1 min-w-0"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        aria-label="New child system name"
      />
      <div className="flex-shrink-0 ">
        <Button
          label="Add System"
          disabled={
            createChildM.isPending || !systemId || newName.trim() === ""
          }
          type="submit"
        />
      </div>
    </form>
  );
};

export default AddSystemForm;
