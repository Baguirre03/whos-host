"use client";

import { edit, getter, remove } from "API/api"; // Added import for remove function
import type { HostType, Party } from "API/types";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Edit,
  Info,
  PartyPopper,
  Trash2,
  Users,
  X,
} from "lucide-react"; // Added Trash2 icon
import Header from "components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import Alert Dialog components

export default function EditParty() {
  const router = useRouter();
  const { partyID } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [hostType, setHostType] = useState<HostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchParty() {
      setIsLoading(true);
      try {
        const data = await getter<Party>(`parties/${partyID}`);
        setParty(data);
        setHostType(data.hostType);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch party:", error);
        setError("Failed to load party details");
        setIsLoading(false);
      }
    }

    if (partyID) {
      fetchParty();
    }
  }, [partyID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);

      // Get date and time values
      const dateValue = formData.get("date") as string;
      const timeValue = formData.get("time") as string;

      // Combine date and time if both are provided
      let dateTime;
      if (timeValue) {
        dateTime = new Date(`${dateValue}T${timeValue}`);
      } else {
        dateTime = new Date(dateValue);
      }

      const updatedParty = {
        name: formData.get("partyName") as string,
        time: dateTime,
        updateAt: new Date(),
        description: formData.get("description") as string,
        hostType: formData.get("hostType") as HostType,
        hostId: formData.get("hostId") as string,
      };

      const response = await edit<Party>(`parties/${partyID}`, updatedParty);
      if (response) {
        router.push(`/party/${partyID}`);
      }
    } catch (error) {
      setError(`Error updating party: ${error}`);
      setIsSubmitting(false);
    }
  };

  // Handle party deletion
  const handleDeleteParty = async () => {
    setIsDeleting(true);
    try {
      await remove(`parties/${partyID}`);
      router.push("/"); // Redirect to home page after successful deletion
    } catch (error) {
      console.error("Failed to delete party:", error);
      setError("Failed to delete party. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin mb-4">
            <PartyPopper className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-300">Loading party details...</p>
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 text-center">
          <AlertCircle className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Party Not Found</h2>
          <p className="text-gray-300 mb-6">
            We couldn&apos;t find the party you&apos;re looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Format the date for the input field
  const formattedDate = new Date(party.time).toISOString().split("T")[0];

  // Extract time for the time input field
  const hours = new Date(party.time).getHours().toString().padStart(2, "0");
  const minutes = new Date(party.time).getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return (
    <>
      <Header addLogin={false} />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-xl"></div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-pink-500 to-violet-500"></div>

            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center gap-2">
                <Edit className="h-6 w-6" />
                Edit Party
              </h1>

              {error && (
                <div className="mb-6 text-pink-400 text-sm bg-pink-900/30 p-3 rounded-lg border border-pink-800/50 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="partyName"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                  >
                    <PartyPopper className="h-4 w-4 text-pink-400" />
                    Party Name
                  </label>
                  <input
                    type="text"
                    id="partyName"
                    name="partyName"
                    defaultValue={party.name}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                    >
                      <Calendar className="h-4 w-4 text-pink-400" />
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      defaultValue={formattedDate}
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                    >
                      <Calendar className="h-4 w-4 text-pink-400" />
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      defaultValue={formattedTime}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hostType"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                  >
                    <Users className="h-4 w-4 text-pink-400" />
                    Host Selection Method
                  </label>
                  <select
                    id="hostType"
                    name="hostType"
                    defaultValue={party.hostType}
                    onChange={(e) => setHostType(e.target.value as HostType)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  >
                    <option value="CLOSEST">Closest (by location)</option>
                    <option value="RANDOM">Random Selection</option>
                    <option value="CHOOSE">Manual Selection</option>
                  </select>
                </div>

                {hostType === "CHOOSE" && (
                  <div>
                    <label
                      htmlFor="hostId"
                      className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                    >
                      <Users className="h-4 w-4 text-pink-400" />
                      Select Host
                    </label>
                    <select
                      id="hostId"
                      name="hostId"
                      defaultValue={party.hostId}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    >
                      {party.members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} (@{member.username})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="description"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                  >
                    <Info className="h-4 w-4 text-pink-400" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={party.description || ""}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 border border-gray-600 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </form>

              {/* Delete Party Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="w-full bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-800/50 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-red-300 border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Party
                    </>
                  )}
                </button>
                <p className="text-center text-gray-400 text-xs mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will permanently delete the party &quot;{party.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteParty}
              className="bg-red-900/70 hover:bg-red-900 text-red-100 border border-red-800/50"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Party"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
