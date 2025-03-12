"use client";
import { useState } from "react";
import type React from "react";

import Header from "components/Header";
import { login } from "API/api";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound, PartyPopper, UserIcon } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loginResponse = await login(username, password);
      if (loginResponse[0]) {
        router.push("/");
      } else {
        setError(
          typeof loginResponse[1] === "string"
            ? loginResponse[1]
            : "Login failed. Please try again."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header addLogin={false} />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-xl"></div>

          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center gap-2">
            <PartyPopper className="h-7 w-7" />
            Welcome Back
          </h1>

          <form
            onSubmit={handleLogin}
            className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden"
          >
            {/* Form background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-pink-500/5 to-transparent rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-violet-500/5 to-transparent rounded-full -ml-20 -mb-20"></div>

            {error && (
              <div className="text-pink-400 text-sm bg-pink-900/30 p-3 rounded-lg border border-pink-800/50 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200 flex items-center gap-1.5"
                >
                  <UserIcon className="h-4 w-4 text-pink-400" />
                  Username
                </label>
                <p className="text-xs text-gray-400 mt-0.5 ml-5">
                  Enter your username
                </p>
                <input
                  id="username"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200 flex items-center gap-1.5"
                >
                  <KeyRound className="h-4 w-4 text-pink-400" />
                  Password
                </label>
                <p className="text-xs text-gray-400 mt-0.5 ml-5">
                  Enter your password
                </p>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Ready to join the party? Let's get you back in!
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
