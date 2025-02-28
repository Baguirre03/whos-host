"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getter } from "API/api";
import { Party } from "API/types";
import Link from "next/link";

export default function PartyPage() {
  const { partyID } = useParams();
  const [party, setParty] = useState<Party | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!partyID) return;

    async function fetchParty() {
      try {
        const data = await getter(`parties/${partyID}`);
        setParty(data);
      } catch (error) {
        console.error("Failed to fetch party:", error);
      }
    }

    fetchParty();
  }, [partyID]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  if (!party) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading party details...
      </div>
    );
  }

  const isHost = currentUserId === party.hostId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800">{party.name}</h1>
        <p className="text-gray-500 mt-2">
          Status:{" "}
          <span className="font-semibold text-blue-600">{party.status}</span>
        </p>

        <div className="mt-4 border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700">Description</h2>
          <p className="text-gray-600">
            {party.description || "No description available."}
          </p>
        </div>

        <div className="mt-4 border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700">Party Time</h2>
          <p className="text-gray-600">
            {new Date(party.time).toLocaleString() || "Not scheduled"}
          </p>
        </div>

        <div className="mt-4 border-t pt-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
            {party.host.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Host</h3>
            <p className="text-gray-600">
              {party.host.name} ({party.host.username})
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Created at: {new Date(party.createdAt).toLocaleString()}
        </p>

        {/* Show Edit and Add Users buttons if the current user is the host */}
        {isHost && (
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              Edit Party
            </button>
            <Link href={`/party/${partyID}/add-user`}>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Add Users
              </button>{" "}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
