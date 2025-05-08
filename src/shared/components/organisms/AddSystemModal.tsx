/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, FormEvent } from "react";
import { Typography, Input } from "../atoms";
import { Button } from "../molecues";
import { toast } from "react-toastify";
import { useCreateSystem } from "@/shared/hooks/useSystemApi";

interface AddSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSystemModal: React.FC<AddSystemModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const createSystemM = useCreateSystem();
  useEffect(() => {
    if (isOpen) {
      setName("");
      setCategory("");
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCat = category.trim();
    if (!trimmedName || !trimmedCat) return;

    // onSubmit?.({ name: trimmedName, category: trimmedCat });
    onCreateSystem({ name: trimmedName, category: trimmedCat });
  };

  const onCreateSystem = (data: any) => {
    createSystemM.mutate(
      {
        name: data.name,
        category: data.category,
      },
      {
        onSuccess: () => {
          onClose();
          toast.success("System created");
        },
        onError: (err) => {
          toast.error(`Failed to create system: ${err.message}`);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <Typography variant="h3">Create New System</Typography>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">System Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Billing Service"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. service, database, frontend"
              required
            />
          </div>

          <div className="mt-8  flex justify-end gap-2">
            <Button
              disabled={createSystemM?.isPending}
              color="secondary"
              label="Cancel"
              onClick={onClose}
            />
            <Button
              disabled={createSystemM?.isPending || !name || !category}
              color="primary"
              label="Create"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSystemModal;
