"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ addLogin }: { addLogin: boolean }) => {
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
    window.location.href = "/";
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg relative overflow-hidden mb-0">
      {/* <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div> */}

      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="text-2xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <PartyPopper className="h-6 w-6 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Who&apos;s Host
          </span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm px-3 py-1 bg-gray-800/80 rounded-full border border-gray-700">
              Hello,{" "}
              <span className="font-semibold text-pink-400">
                {user.username}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-white hover:text-pink-300 transition-all duration-200 text-sm rounded-full flex items-center gap-1 px-4"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <nav className="flex items-center space-x-3">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-2 px-5 rounded-full transition-all duration-200 shadow-md hover:shadow-pink-500/20 inline-flex items-center"
            >
              Sign Up
            </Link>
            {addLogin && (
              <Link
                href="/login"
                className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white hover:text-pink-300 transition-all duration-200 rounded-full py-2 px-5 inline-flex items-center"
              >
                Log In
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-pink-500 to-violet-500 w-full" />
    </header>
  );
};

export default Header;
