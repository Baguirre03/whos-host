"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { edit, getter } from "API/api";
import { UserBase } from "API/types";
import debounce from "lodash/debounce";

export default function AddUserPage() {
  const { partyID } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserBase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = debounce(async (query: string) => {
    try {
      const results = await getter<UserBase[]>(`users/search?q=${query}`);
      setUsers(results);
    } catch (err) {
      console.error("Failed to search users:", err);
    }
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchUsers(e.target.value);
  };

  const handleAddUser = async (userID: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await edit(`parties/${partyID}/members`, { id: userID });
      setSuccess("User added successfully!");
      setSearchTerm("");
      setUsers([]);
    } catch (err) {
      setError(
        "Failed to add user. They might already be in the party." + `: ${err}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add Party Member</h1>
          <p className="text-gray-600 mt-2">
            Search for users to add to your party
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Users
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by username or name..."
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {users.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => user.id && handleAddUser(user.id)}
                    disabled={isLoading || !user.id}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 font-medium text-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchTerm && users.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No users found matching your search.
            </p>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center bg-green-50 p-3 rounded">
              {success}
            </div>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md font-medium
              hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
