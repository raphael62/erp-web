"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type BExec = { id: number; code: string; name: string };

export default function BExecsPage() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch list
  const { data: bexecs, isLoading } = useQuery<BExec[]>({
    queryKey: ["bexecs"],
    queryFn: async () => {
      const res = await fetch("/api/bexecs");
      return res.json();
    },
  });

  // Add mutation
  const addBExec = useMutation({
    mutationFn: async (newData: { code: string; name: string }) => {
      const res = await fetch("/api/bexecs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bexecs"] });
      setShowModal(false);
    },
  });

  // Form handling
  const { register, handleSubmit, reset } = useForm<{ code: string; name: string }>();

  const onSubmit = (data: { code: string; name: string }) => {
    addBExec.mutate(data);
    reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Business Execs</h1>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create New
      </button>

      {isLoading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <table className="mt-4 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Name</th>
            </tr>
          </thead>
          <tbody>
            {bexecs?.map((b) => (
              <tr key={b.id}>
                <td className="border px-2 py-1">{b.code}</td>
                <td className="border px-2 py-1">{b.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Business Exec</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("code")}
                placeholder="Code"
                className="w-full border p-2 rounded"
              />
              <input
                {...register("name")}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
