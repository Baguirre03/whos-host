"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, PartyBase } from "API/types";

export default function LoggedInPage() {
  const [parties, setParties] = useState<PartyBase[]>([]);
  const [partiesAdmin, setPartiesAdmin] = useState<PartyBase[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setParties(userData.parties || []);
      setPartiesAdmin(userData.partiesAdmin || []);
    }
  }, []);
  console.log(user);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Parties</h2>
            <Link
              href="/create-party"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 inline-flex items-center"
            >
              Create New Party
            </Link>
          </div>
          {parties.length === 0 && partiesAdmin.length === 0 ? (
            <p className="text-gray-600 text-lg">
              You haven&apos;t created any parties yet. Create your first party
              to get started!
            </p>
          ) : (
            <>
              <div className="grid gap-4">
                {partiesAdmin.map((party) => (
                  <Link
                    key={party.id}
                    href={`/party/${party.id}`}
                    className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      {party.name}
                    </h3>
                  </Link>
                ))}
              </div>
              <div className="grid gap-4">
                {parties.map((party) => (
                  <Link
                    key={party.id}
                    href={`/party/${party.id}`}
                    className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      {party.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
