"use client";

import Link from "next/link";
import SignupButton from "./SignupButton";
import LoginButton from "./LoginButton";
import { useEffect } from "react";
import { post } from "API/api";

const Header = () => {
  useEffect(() => {
    const fetch = async () => {
      const user: object = {
        username: "post test",
        name: "HELLO WORLD",
        description: "this is a descriptions",
        lattitude: 0,
        longitude: 0,
        password: "passsssword",
      };

      const data = await post(true, "users", user); // true means not prod, ROUTE, data
      console.log(data, "found");
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
          <LoginButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
