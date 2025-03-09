"use client";

import Header from "../components/Header";
import LoggedInPage from "./loggedin";
import LoggedOutPage from "./loggedout";

export default function HomePage() {
  const user = localStorage.getItem("user");
  const isLoggedIn = user != null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header addLogin={true} />
      {isLoggedIn ? <LoggedInPage /> : <LoggedOutPage />}
    </div>
  );
}
