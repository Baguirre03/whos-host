"use client";
import Header from "../../components/Header";
import { useState, useRef } from "react";
import { login, post } from "API/api";
import { User, CreateUserRequest, ErrorResponse } from "API/types";
import { useRouter } from "next/navigation";
import { useGoogleMapsApi } from "app/utils/googleMapsConfig";
import { StandaloneSearchBox } from "@react-google-maps/api";

import {
  AlertCircle,
  Info,
  KeyRound,
  MapPin,
  PartyPopper,
  UserIcon,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const userObject = {
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    description: "",
    lattitude: 0,
    longitude: 0,
    address: "",
  };

  const [user, setUser] = useState(userObject);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user.password !== user.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const createUserRequest: CreateUserRequest = {
        username: user.username,
        password: user.password,
        name: user.name,
        description: user.description || undefined,
        lattitude: user.lattitude,
        longitude: user.longitude,
        address: user.address,
        statusCode: 0,
      };

      const response = await post<User | ErrorResponse>(
        "users",
        createUserRequest
      );

      if (typeof response === "object" && "statusCode" in response) {
        setError("Username already exists");
      } else {
        setError(null);
        const loginResponse = await login(user.username, user.password);
        if (loginResponse[0]) {
          router.push("/");
        } else {
          console.log(loginResponse);
          setError("Error occured during login, please try again");
        }
      }
    } catch (error) {
      setError(`${error}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchBoxRef = useRef<google.maps.places.SearchBox>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useGoogleMapsApi();

  const handleOnPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    setUser((prev) => ({
      ...prev,
      address: places?.[0]?.formatted_address || "",
      lattitude: places?.[0]?.geometry?.location?.lat() || 0,
      longitude: places?.[0]?.geometry?.location?.lng() || 0,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header addLogin={true} />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-xl"></div>

          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center gap-2">
            <PartyPopper className="h-7 w-7" />
            Join the Party
          </h1>

          <form
            onSubmit={handleSignup}
            className="space-y-5 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden"
          >
            {/* Form background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-pink-500/5 to-transparent rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-violet-500/5 to-transparent rounded-full -ml-20 -mb-20"></div>

            <div>
              <label
                htmlFor="username"
                className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
              >
                <UserIcon className="h-4 w-4 text-pink-400" />
                Username <span className="text-pink-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mt-0.5 ml-5">
                Required for login
              </p>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
              >
                <UserIcon className="h-4 w-4 text-pink-400" />
                Full Name <span className="text-pink-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mt-0.5 ml-5">
                Your display name
              </p>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                required
              />
            </div>

            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handleOnPlacesChanged}
              >
                <div>
                  <label
                    htmlFor="address"
                    className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
                  >
                    <MapPin className="h-4 w-4 text-pink-400" />
                    Address <span className="text-pink-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5 ml-5">
                    Your location
                  </p>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    ref={inputRef}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                    required
                  />
                </div>
              </StandaloneSearchBox>
            )}

            <div>
              <label
                htmlFor="description"
                className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
              >
                <Info className="h-4 w-4 text-pink-400" />
                Description
              </label>
              <p className="text-xs text-gray-400 mt-0.5 ml-5">
                Tell us about yourself
              </p>
              <input
                type="text"
                id="description"
                name="description"
                value={user.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className=" text-sm font-medium text-gray-200 flex items-center gap-1.5"
              >
                <KeyRound className="h-4 w-4 text-pink-400" />
                Password <span className="text-pink-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mt-0.5 ml-5">
                Must be at least 8 characters
              </p>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-200 flex items-center gap-1.5"
              >
                <KeyRound className="h-4 w-4 text-pink-400" />
                Confirm Password <span className="text-pink-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mt-0.5 ml-5">
                Re-enter your password
              </p>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                required
              />
            </div>

            {error && (
              <div className="text-pink-400 text-sm bg-pink-900/30 p-3 rounded-lg border border-pink-800/50 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-400 text-sm">
              By signing up, you agree to join the party and have a great time!
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
