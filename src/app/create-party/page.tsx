"use client";

import Header from "components/Header";
import { post } from "../../API/api";
import { HostType, Party } from "API/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateParty() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : "";
    const partyData: Party = {
      name: formData.get("partyName") as string,
      time: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      host: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : "",
      members: [],
      hostType: formData.get("hostType") as HostType,
      adminId: user != "" ? user.id : "",
      hostId: user != "" ? user.id : "",
    };

    const response = await post<Party>("parties", partyData);
    if (response) {
      router.push("/");
    } else {
      setError("Error creating party");
    }
  };

  return (
    <>
      <Header addLogin={false}></Header>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Party</h1>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time:
              </label>
              <input
                type="time"
                id="time"
                name="time"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Party
            </button>
          </form>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </>
  );
}
