"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User, PartyBase } from "API/types";
import { getter } from "API/api";
import { Calendar, Crown, Music, PartyPopper, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SortAsc } from "lucide-react";

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

type SortOption = "date-closest" | "date-oldest" | "type";

export default function LoggedInPage() {
  const [parties, setParties] = useState<PartyBase[]>([]);
  const [partiesAdmin, setPartiesAdmin] = useState<PartyBase[]>([]);
  const [partiesHost, setPartiesHost] = useState<PartyBase[]>([]);
  // const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("date-closest");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const userData = JSON.parse(userStr);
        const freshUserData = await getter<User>(`users/${userData.id}`);
        // setUser(freshUserData);
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
    return (
      <div className="bg-gray-900 text-red-400 text-center p-4 rounded-md">
        <p className="font-medium">{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  const allParties = removeDuplicates(partiesAdmin, partiesHost, parties);

  // Sort parties based on the selected option
  const sortedParties = [...allParties].sort((a, b) => {
    switch (sortOption) {
      case "date-closest":
        return (
          new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()
        );
      case "date-oldest":
        return (
          new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime()
        );
      case "type":
        // First sort by admin status
        const aIsAdmin = partiesAdmin.some((p) => p.id === a.id);
        const bIsAdmin = partiesAdmin.some((p) => p.id === b.id);
        if (aIsAdmin && !bIsAdmin) return -1;
        if (!aIsAdmin && bIsAdmin) return 1;

        // Then by host status
        const aIsHost = partiesHost.some((p) => p.id === a.id);
        const bIsHost = partiesHost.some((p) => p.id === b.id);
        if (aIsHost && !bIsHost) return -1;
        if (!aIsHost && bIsHost) return 1;

        // Default to date sorting if both have the same status
        return (
          new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()
        );
      default:
        return 0;
    }
  });

  const getRandomGradient = () => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-teal-400",
      "from-pink-500 to-orange-400",
      "from-green-400 to-cyan-500",
      "from-indigo-500 to-purple-500",
      "from-yellow-400 to-orange-500",
      "from-red-500 to-pink-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Get the display text for the current sort option
  const getSortOptionText = (option: SortOption): string => {
    switch (option) {
      case "date-closest":
        return "Newest First";
      case "date-oldest":
        return "Oldest First";
      case "type":
        return "By Role (Admin, Host, Member)";
      default:
        return "Sort";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white -mt-1">
      <main className="flex-grow container mx-auto px-4 pt-0 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Your Parties
          </h1>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full border border-gray-700 transition-colors duration-200">
                <SortAsc size={16} className="text-pink-400" />
                <span>{getSortOptionText(sortOption)}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-xl">
                <DropdownMenuItem
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                  onClick={() => setSortOption("date-closest")}
                >
                  Closest Parties
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                  onClick={() => setSortOption("date-oldest")}
                >
                  Oldest Parties
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                  onClick={() => setSortOption("type")}
                >
                  By Role (Admin, Host, Member)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-pink-500/20"
            >
              <Link href="/create-party" className="flex items-center gap-2">
                <Plus size={18} />
                Create New Party
              </Link>
            </Button>
          </div>
        </div>

        {sortedParties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PartyPopper className="w-16 h-16 text-pink-500 mb-4" />
            <p className="text-gray-300 text-xl max-w-md">
              You haven&apos;t joined any parties yet. Create your first party
              to get the celebration started!
            </p>
            <Button
              asChild
              className="mt-6 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200"
            >
              <Link href="/create-party" className="flex items-center gap-2">
                <Plus size={18} />
                Create Your First Party
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedParties.map((party) => {
              const isAdmin = partiesAdmin.some((p) => p.id === party.id);
              const isHost = partiesHost.some((p) => p.id === party.id);
              const gradient = getRandomGradient();

              return (
                <Link
                  key={party.id}
                  href={`/party/${party.id}`}
                  className="block group"
                >
                  <Card className="h-full overflow-hidden bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 group-hover:translate-y-[-5px]">
                    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500 transition-all duration-300">
                          {party.name}
                        </h3>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full flex items-center gap-1 border border-indigo-700/50">
                              <Crown size={14} />
                              Admin
                            </span>
                          )}
                          {isHost && (
                            <span className="px-3 py-1 bg-pink-900/50 text-pink-300 text-sm rounded-full flex items-center gap-1 border border-pink-700/50">
                              <Music size={14} />
                              Host
                            </span>
                          )}
                          {!isAdmin && !isHost && (
                            <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full flex items-center gap-1 border border-gray-600/50">
                              <Users size={14} />
                              Guest
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm mt-auto">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {party.time
                            ? new Date(party.time).toLocaleDateString()
                            : "Date not set"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
