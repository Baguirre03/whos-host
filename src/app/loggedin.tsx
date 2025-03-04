"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, PartyBase } from "API/types";
import { getter } from "API/api";

function removeDuplicates(
  arrOne: PartyBase[],
  arrTwo: PartyBase[],
  arrThree: PartyBase[]
): PartyBase[] {
  const uniqueParties = new Map<string, PartyBase>();

  [...arrOne, ...arrTwo, ...arrThree].forEach((party) => {
    if (!uniqueParties.has(party.id!)) uniqueParties.set(party.id!, party);
  });
  return Array.from(uniqueParties.values());
}

export default function LoggedInPage() {
  const [parties, setParties] = useState<PartyBase[]>([]);
  const [partiesAdmin, setPartiesAdmin] = useState<PartyBase[]>([]);
  const [partiesHost, setPartiesHost] = useState<PartyBase[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const userData = JSON.parse(userStr);
        const freshUserData = await getter<User>(`users/${userData.id}`);
        setUser(freshUserData);
        setParties(freshUserData.parties || []);
        setPartiesAdmin(freshUserData.partiesAdmin || []);
        setPartiesHost(freshUserData.hostedParties || []);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data");
      }
    }

    fetchUserData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  console.log(user);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Parties</h1>
          <Link
            href="/create-party"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 inline-flex items-center"
          >
            Create New Party
          </Link>
        </div>

        {parties.length === 0 &&
        partiesAdmin.length === 0 &&
        partiesHost.length === 0 ? (
          <p className="text-gray-600 text-lg">
            You haven&apos;t joined any parties yet. Create your first party to
            get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {removeDuplicates(partiesAdmin, partiesHost, parties).map(
              (party) => {
                const isAdmin = partiesAdmin.some((p) => p.id === party.id);
                const isHost = partiesHost.some((p) => p.id === party.id);
                return (
                  <Link
                    key={party.id}
                    href={`/party/${party.id}`}
                    className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {party.name}
                      </h3>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
                            Admin
                          </span>
                        )}
                        {isHost && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                            Host
                          </span>
                        )}
                        {!isAdmin && !isHost && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                            Guest
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}
