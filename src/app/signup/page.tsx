"use client";
import Header from "../../components/Header";
import { useState, useRef } from "react";
import { login, post } from "API/api";
import { User, CreateUserRequest, ErrorResponse } from "API/types";
import { useRouter } from "next/navigation";
import {
  useJsApiLoader,
  StandaloneSearchBox,
  Libraries,
} from "@react-google-maps/api";

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";
const libraries: Libraries = ["places"];

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries,
  });

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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header addLogin={true} />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-8">
          <h1 className="text-3xl font-bold mb-6 text-black text-center">
            Create an Account
          </h1>
          <form
            onSubmit={handleSignup}
            className="space-y-4 bg-white p-10 rounded-xl shadow-lg border border-gray-200"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mt-0.5">Required for login</p>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mt-0.5">Your display name</p>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
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
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Your location</p>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    ref={inputRef}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                    required
                  />
                </div>
              </StandaloneSearchBox>
            )}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={user.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Must be at least 8 characters
              </p>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Re-enter your password
              </p>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
