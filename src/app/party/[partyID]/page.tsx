"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getter } from "API/api";
import type { Party, User } from "API/types";
import Link from "next/link";
import { useGoogleMapsApi } from "../../utils/googleMapsConfig";
import {
  Calendar,
  Clock,
  Edit,
  Info,
  MapPin,
  Music,
  PartyPopper,
  Plus,
  ShuffleIcon as Random,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Map from "components/Map";

export default function PartyPage() {
  const { partyID } = useParams();
  const [party, setParty] = useState<Party | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { isLoaded } = useGoogleMapsApi();

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

    if (!partyID) return;

    async function fetchParty() {
      try {
        const data = await getter<Party>(`parties/${partyID}`);
        const userStr = localStorage.getItem("user");
        let freshData: User;
        if (userStr) {
          const userData = JSON.parse(userStr);
          freshData = await getter<User>(`users/${userData.id}`);
          setUser(freshData);
        }
        setParty(data);
      } catch (error) {
        console.error("Failed to fetch party:", error);
      }
    }

    fetchParty();
  }, [partyID]);

  if (!party) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-300">
        <div className="flex flex-col items-center">
          <div className="animate-spin mb-4">
            <PartyPopper className="h-8 w-8 text-pink-500" />
          </div>
          <p>Loading party details...</p>
        </div>
      </div>
    );
  }

  const isHost = currentUserId === party.hostId;
  const isAdmin = currentUserId === party.adminId;
  const isPastParty = new Date(party.time) < new Date();

  const getRandomGradient = () => {
    const gradients = [
      "from-pink-500 to-purple-500",
      "from-blue-500 to-teal-400",
      "from-indigo-500 to-purple-500",
      "from-green-400 to-cyan-500",
      "from-yellow-400 to-orange-500",
      "from-red-500 to-pink-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          {/* Party header with gradient */}
          <div className="h-2 bg-gradient-to-r from-pink-500 to-violet-500"></div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <PartyPopper className="h-6 w-6 text-pink-500" />
                  {party.name}
                </h1>
                <div className="flex items-center mt-2 text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {isPastParty ? (
                      <span className="text-red-400">Passed</span>
                    ) : (
                      <span className="text-emerald-400">{party.status}</span>
                    )}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-3 mt-2 md:mt-0">
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-70 text-black hover:bg-gray-700 hover:text-pink-300 transition-all duration-200 rounded-full flex items-center gap-1"
                  >
                    <Link href={`/party/${partyID}/edit`}>
                      <Edit className="h-4 w-4" />
                      Edit Party
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-pink-500/20 flex items-center gap-1"
                  >
                    <Link href={`/party/${partyID}/add-user`}>
                      <Plus className="h-4 w-4" />
                      Add Users
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Party details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-pink-400" />
                    Description
                  </h2>
                  <p className="text-gray-300">
                    {party.description || "No description available."}
                  </p>
                </div>

                {/* Host Selection */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <Random className="h-5 w-5 text-pink-400" />
                    Host Selection
                  </h2>
                  <p className="text-gray-300">
                    {party.hostType === "CLOSEST" && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        Host will be chosen based on closest location to all
                        members
                      </span>
                    )}
                    {party.hostType === "RANDOM" && (
                      <span className="flex items-center gap-1">
                        <Random className="h-4 w-4 text-purple-400" />
                        Host will be randomly selected from all members
                      </span>
                    )}
                    {party.hostType === "CHOOSE" && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-400" />
                        Host will be manually selected
                      </span>
                    )}
                  </p>
                </div>

                {/* Party Time */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-pink-400" />
                    Party Time
                  </h2>
                  <p className="text-gray-300">
                    {new Date(party.time).toLocaleString() || "Not scheduled"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Host Information */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                    <Music className="h-5 w-5 text-pink-400" />
                    Host
                  </h2>

                  {isHost && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                        {party.host.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">You</p>
                        <p className="text-pink-300 text-sm">
                          You are hosting this one!
                        </p>
                      </div>
                    </div>
                  )}

                  {party.host && !isHost && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                        {party.host.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {party.host.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          @{party.host.username}
                        </p>
                      </div>
                    </div>
                  )}

                  {!party.host && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-600 text-gray-300 flex items-center justify-center rounded-full text-sm font-bold">
                        <Music className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">No Host Yet</p>
                        <p className="text-gray-400 text-sm">
                          Host will be selected soon
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-gray-500">
                    Created at:{" "}
                    {party.createdAt
                      ? new Date(party.createdAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                {/* Member Locations Map Toggle */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-pink-400" />
                      Member Locations
                    </h2>
                    <Button
                      onClick={() => setShowMap(!showMap)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 t hover:bg-gray-700 text-black hover:text-pink-300 transition-all duration-200 rounded-full"
                    >
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>

                  {showMap && isLoaded && (
                    <div className="h-64 w-full rounded-lg overflow-hidden mt-3 border border-gray-600">
                      <Map
                        members={party.members}
                        currentUser={user}
                        host={party.host}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-pink-400" />
                Members
              </h2>

              {party.members && party.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {party.members.map((member) => {
                    const gradient = getRandomGradient();
                    const isPartyHost =
                      party.host && member.id === party.host.id;

                    return (
                      <div
                        key={member.username}
                        className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${gradient} text-white flex items-center justify-center rounded-full text-lg font-bold`}
                        >
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white flex items-center gap-1">
                            {member.name}
                            {isPartyHost && (
                              <Music className="h-3 w-3 text-pink-400 ml-1" />
                            )}
                          </p>
                          <p className="text-sm text-gray-400">
                            @{member.username}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Users className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                  <p>No members have joined this party yet.</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
