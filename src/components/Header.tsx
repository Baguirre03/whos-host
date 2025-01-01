"use client";

import Link from "next/link";
import SignupButton from "./SignupButton";
import LoginButton from "./LoginButton";
import { useEffect, useState } from "react";
import { getter, post } from "API/api";
import { User, UserBase } from "API/types";

const Header = () => {
  const [tokenState, setToken] = useState<string | null>(null);

  const handleLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await post("auth/login", credentials);
      const { accessToken } = response;
      // Store the token
      localStorage.setItem("jwt", accessToken);
      setToken(accessToken);

      // You might want to store user data in a global state management solution
      // like Redux or Context
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (show message to user, etc.)
    }
  };

  useEffect(() => {
    const fetch = async () => {
      // practicing getting users
      const users = await getter("users");
      console.log(users);
    };
    fetch();
  }, []);

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Hosts Host
        </Link>
        <nav className="space-x-4">
          <SignupButton />
          <LoginButton onLogin={handleLogin} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
