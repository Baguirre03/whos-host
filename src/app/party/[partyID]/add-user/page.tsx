"use client";
import { useParams, useRouter } from "next/navigation";
import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { edit, getter } from "API/api";
import type { UserBase } from "API/types";
import debounce from "lodash/debounce";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";

interface SearchedUser extends UserBase {
  isMember?: boolean;
}

export default function AddUserPage() {
  const { partyID } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Create a stable debounced search function with useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setUsers([]);
        setIsSearching(false);
        return;
      }

      try {
        const results = await getter<SearchedUser[]>(
          `users/${partyID}/search?q=${query}`
        );
        setUsers(results);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setIsSearching(true);
      debouncedSearch(value);
    } else {
      setUsers([]);
    }
  };

  // Clear any pending debounced searches on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleAddUser = async (userID: string, userName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await edit(`parties/${partyID}/members`, { id: userID });
      setSuccess(`${userName} added successfully!`);

      // Update the user in the list to show as a member
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userID ? { ...user, isMember: true } : user
        )
      );
    } catch (err) {
      setError("Failed to add user. They might already be in the party.");
      console.error("Error adding user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get a random gradient for user avatars
  const getRandomGradient = (userId: string | undefined) => {
    if (!userId) return "from-gray-500 to-gray-600";

    const gradients = [
      "from-pink-500 to-purple-500",
      "from-blue-500 to-teal-400",
      "from-indigo-500 to-purple-500",
      "from-green-400 to-cyan-500",
      "from-yellow-400 to-orange-500",
      "from-red-500 to-pink-500",
    ];

    // Use the user ID to deterministically select a gradient
    // This ensures the same user always gets the same gradient
    const index =
      userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      gradients.length;
    return gradients[index];
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-xl"></div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-pink-500 to-violet-500"></div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  Add Party Members
                </h1>
                <p className="text-gray-300 mt-2">
                  Search for users to add to your party
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="search"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5 mb-2"
                  >
                    <Search className="h-4 w-4 text-pink-400" />
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search by username or name..."
                      className="block w-full px-4 py-3 pl-10 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-pink-500 focus:border-pink-500 placeholder-gray-400"
                    />
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />

                    {/* Fixed-size container for the spinner to prevent layout shifts */}
                    <div className="absolute right-3 top-3.5 h-4 w-4 flex items-center justify-center">
                      {isSearching && (
                        <div className="animate-spin h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fixed height container for results to prevent layout shifts */}
                <div className="min-h-[200px]">
                  {users.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {users.map((user) => {
                        const gradient = getRandomGradient(user.id);
                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg border border-gray-700 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 bg-gradient-to-r ${gradient} text-white flex items-center justify-center rounded-full font-medium`}
                              >
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  @{user.username}
                                </p>
                              </div>
                            </div>

                            {user.isMember ? (
                              <div className="px-3 py-1.5 bg-gray-700/50 text-gray-400 rounded-full text-sm border border-gray-600 flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                                <span>Member</span>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  user.id && handleAddUser(user.id, user.name)
                                }
                                disabled={isLoading}
                                className="px-3 py-1.5 bg-gray-700 text-pink-400 rounded-full hover:bg-gray-600 font-medium text-sm border border-gray-600 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : searchTerm && !isSearching ? (
                    <div className="text-gray-400 text-center py-6 bg-gray-700/30 rounded-lg border border-gray-700">
                      <User className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                      <p>No users found matching your search.</p>
                    </div>
                  ) : null}
                </div>

                {error && (
                  <div className="text-pink-400 text-sm bg-pink-900/30 p-3 rounded-lg border border-pink-800/50 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="text-green-400 text-sm bg-green-900/30 p-3 rounded-lg border border-green-800/50 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Party
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
