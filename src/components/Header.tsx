"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SignupButton from "./SignupButton";
import LoginButton from "./LoginButton";

const Header = ({ addLogin = true }: { addLogin: boolean }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-gray-100 text-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-black transition-colors"
        >
          Who&apos;s Host
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <p className="text-sm">Hello, {user.username}</p>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <nav className="flex items-center space-x-4">
            <SignupButton />
            {addLogin && <LoginButton />}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
