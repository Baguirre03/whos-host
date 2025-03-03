"use client";

import { edit, getter } from "API/api";
import { HostType, Party } from "API/types";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditParty() {
  const router = useRouter();
  const { partyID } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    async function fetchParty() {
      try {
        const data = await getter<Party>(`parties/${partyID}`);
        setParty(data);
      } catch (error) {
        console.error("Failed to fetch party:", error);
        setError("Failed to load party details");
      }
    }

    if (partyID) {
      fetchParty();
    }
  }, [partyID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const updatedParty = {
      name: formData.get("partyName") as string,
      time: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      hostType: formData.get("hostType") as HostType,
    };

    try {
      console.log(partyID);
      const response = await edit<Party>(`parties/${partyID}`, updatedParty);

      console.log(response);
      if (response) {
        router.push(`/party/${partyID}`);
      }
    } catch (error) {
      setError("Error updating party" + `: ${error}`);
    }
  };

  if (!party) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md m-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Party</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="partyName"
              className="block text-sm font-medium text-gray-700"
            >
              Party Name:
            </label>
            <input
              type="text"
              id="partyName"
              name="partyName"
              defaultValue={party.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={new Date(party.time).toISOString().split("T")[0]}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="hostType"
              className="block text-sm font-medium text-gray-700"
            >
              Host Type:
            </label>
            <select
              id="hostType"
              name="hostType"
              defaultValue={party.hostType}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="CLOSEST">Closest</option>
              <option value="RANDOM">Random</option>
              <option value="CHOOSE">Choose</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={party.description || ""}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
