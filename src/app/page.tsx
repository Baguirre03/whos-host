"use client";

import Header from "../components/Header";
import LoggedInPage from "./loggedin";
import LoggedOutPage from "./loggedout";

export default function HomePage() {
  const loggedIn = localStorage.getItem("user");
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header addLogin={true} />
      <main className="flex-grow container mx-auto px-4 py-8"></main>
      {loggedIn ? <LoggedInPage /> : <LoggedOutPage />}
    </div>
  );
}
