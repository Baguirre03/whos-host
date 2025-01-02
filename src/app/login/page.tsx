"use client";
import { useState } from "react";
import Header from "components/Header";
import { login } from "API/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header addLogin={false} />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-8">
          <h1 className="text-3xl font-bold mb-6 text-black text-center">
            Sign in to your account
          </h1>
          <form
            onSubmit={handleLogin}
            className="space-y-6 bg-white p-10 rounded-xl shadow-lg border border-gray-200"
          >
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your username
                </p>
                <input
                  id="username"
                  type="username"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your password
                </p>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
