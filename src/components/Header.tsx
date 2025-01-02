"use client";

import Link from "next/link";
import SignupButton from "./SignupButton";
import LoginButton from "./LoginButton";
import { useEffect } from "react";
import { getter } from "API/api";
const Header = ({ addLogin = true }: { addLogin: boolean }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetch = async () => {
      // practicing getting users
      const users = await getter("users");
      console.log(users);
    };
    fetch();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Hosts Host
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <p>Hello, {user.username}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <nav className="space-x-4">
            <SignupButton />
            {addLogin && <LoginButton />}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
