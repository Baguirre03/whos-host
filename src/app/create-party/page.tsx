"use client";

import Header from "components/Header";
import { post } from "../../API/api";
import type { HostType, Party } from "API/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Clock,
  Info,
  PartyPopper,
  Users,
} from "lucide-react";

export default function CreateParty() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : "";

      // Combine date and time
      const dateValue = formData.get("date") as string;
      const timeValue = formData.get("time") as string;
      const dateTimeString = `${dateValue}T${timeValue}`;

      const partyData: Party = {
        name: formData.get("partyName") as string,
        time: new Date(dateTimeString),
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
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error creating party:", err);
      setError("Failed to create party. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header addLogin={false} />
      <div className="flex justify-center items-center min-h-screen bg-gray-900 py-12 px-4">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-xl"></div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-pink-500 to-violet-500"></div>

            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center gap-2">
                <PartyPopper className="h-6 w-6" />
                Create a New Party
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
                  <p className="text-xs text-gray-400 mt-0.5 ml-5">
                    Give your party a catchy name
                  </p>
                  <input
                    type="text"
                    id="partyName"
                    name="partyName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    placeholder="Summer BBQ, Game Night, etc."
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
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                    >
                      <Clock className="h-4 w-4 text-pink-400" />
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
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
                  <p className="text-xs text-gray-400 mt-0.5 ml-5">
                    How should the host be determined?
                  </p>
                  <select
                    id="hostType"
                    name="hostType"
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  >
                    <option value="CLOSEST">Closest (by location)</option>
                    <option value="RANDOM">Random Selection</option>
                    <option value="CHOOSE">Manual Selection</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                  >
                    <Info className="h-4 w-4 text-pink-400" />
                    Description
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5 ml-5">
                    Tell everyone what this party is about
                  </p>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    placeholder="What should guests know about this party?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating Party...
                    </>
                  ) : (
                    <>
                      <PartyPopper className="h-5 w-5" />
                      Create Party
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                After creating your party, you&apos;ll be able to invite friends
                and assign roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
