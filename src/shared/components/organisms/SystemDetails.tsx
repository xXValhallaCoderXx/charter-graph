"use client";
import {
  useFetchSystem,
  useFetchDescendants,
  useRemoveChildSystem,
  useUpdateSystem,
  //   useCreateChildSystem
} from "@/shared/hooks/useSystemApi";
// import { useRouter } from 'next/navigation';
import { FC, useState, useEffect } from "react";
import { System } from "@/shared/slices/system/system.types";

interface ISystemDetailsProps {
  systemId: string;
}

const SystemDetails: FC<ISystemDetailsProps> = ({ systemId }) => {
  // const router = useRouter();
  // Queries
  const {
    data: system,
    isLoading: loadingSys,
    error: errSys,
  } = useFetchSystem(systemId);
  const { data: children = [], isLoading: loadingDesc } =
    useFetchDescendants(systemId);

  // Mutations
  const updateSystemM = useUpdateSystem(systemId);
  //   const createChildM = useCreateChildSystem(systemId);
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

  if (loadingSys || loadingDesc) return <div>Loading…</div>;
  if (errSys || !system) return <div>Error loading system</div>;

  // Handlers for onBlur and actions
  const handleNameBlur = () => {
    if (name !== system.name) {
      updateSystemM.mutate({ name });
    }
  };

  const handleCategoryBlur = () => {
    if (category !== system.category) {
      updateSystemM.mutate({ category });
    }
  };

  const handleDelete = () => {
    removeChildM.mutate(systemId);
  };

  //   const handleAddChild = (childName: string) => {
  //     if (childName.trim()) {
  //       createChildM.mutate(childName.trim());
  //     }
  //   };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">System Details</h2>

      <label className="block mb-2">
        <span className="text-sm">Name</span>
        <input
          className="mt-1 w-full border rounded p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Category</span>
        <input
          className="mt-1 w-full border rounded p-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={handleCategoryBlur}
        />
      </label>

      <button
        className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
        onClick={handleDelete}
      >
        Delete System
      </button>

      <hr className="my-4" />

      <h3 className="font-medium mb-2">Child Systems</h3>
      <ul className="space-y-1 mb-4">
        {children.map((child: System) => (
          <li key={child.id} className="flex justify-between">
            <span
              className="text-blue-600 cursor-pointer"
              //   onClick={() =>
              //     router.push(`/?rootId=${systemId}&selectedId=${child.id}`, {
              //       shallow: true,
              //     })
              //   }
            >
              {child.name}
            </span>
            <button
              className="text-sm text-red-500"
              //   onClick={() => removeChildM.mutate(child.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          placeholder="New child name"
          className="flex-1 border rounded p-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              //   createChildM.mutate((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => {
            const input = document.querySelector(
              'input[placeholder="New child name"]'
            ) as HTMLInputElement;
            // createChildM.mutate(input.value.trim());
            input.value = "";
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
export default SystemDetails;
