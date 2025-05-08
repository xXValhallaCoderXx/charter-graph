/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, FC } from "react";
import { toast } from "react-toastify";
import { useCreateInterface } from "@/shared/hooks/useInterfaceApi";
import { Button, Select } from "@/shared/components/molecues";
import { Typography, Input, Skeleton } from "@/shared/components/atoms";

interface IAddInterfaceFormProps {
  systemId: string;
  isLoading: boolean;
  options: any;
}

const AddInterfaceForm: FC<IAddInterfaceFormProps> = ({
  systemId,
  isLoading,
  options,
}) => {
  const [connectionType, setConnectionType] = useState("");
  const [connectedSystem, setConnectedSystem] = useState("");
  const [newDirectional, setNewDirectional] = useState(false);

  const createM = useCreateInterface(systemId);

  const handleAdd = () => {
    if (!systemId || !connectionType.trim()) return;

    createM.mutate(
      {
        system_a_id: systemId,
        system_b_id: connectedSystem,
        connection_type: connectionType.trim(),
        directional: newDirectional,
      },
      {
        onSuccess: () => {
          toast.success("Interface added");
          setConnectionType("");
          setConnectedSystem("");
          setNewDirectional(false);
        },
        onError: (err) => {
          toast.error(`Add failed: ${err.message}`);
        },
      }
    );
  };

  return (
    <>
      <Typography variant="body" fw="semibold" className="mb-2">
        Add New Interface
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <Typography as="span" size="sm" fw="semibold">
            Connection Type
          </Typography>
          <Skeleton isLoading={isLoading}>
            <Input
              disabled={!systemId}
              placeholder="e.g. REST"
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
              className="mt-1"
            />
          </Skeleton>
        </label>

        <label className="block">
          <Typography as="span" size="sm" fw="semibold">
            Other System ID
          </Typography>
          <Skeleton isLoading={isLoading}>
            <Select
              onChange={(e) => {
                setConnectedSystem(e?.target?.value);
              }}
              value={connectedSystem}
              disabled={!systemId}
              className="mt-1 w-full"
              options={[{ value: "", label: "— none —" }, ...options]}
            />
          </Skeleton>
        </label>
      </div>
      <div className="flex justify-between ">
        <div className="flex items-center justify-between gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={newDirectional}
            onChange={(e) => setNewDirectional(e.target.checked)}
            disabled={!systemId}
            id="directional-toggle"
          />
          <label htmlFor="directional-toggle" className="text-sm">
            One-way?
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            label="Add Interface"
            disabled={!systemId || createM.isPending}
            onClick={handleAdd}
          />
        </div>
      </div>
    </>
  );
};

export default AddInterfaceForm;
