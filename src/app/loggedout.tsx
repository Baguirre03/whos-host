"use client";

import Link from "next/link";

export default function LoggedOutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Welcome to Who&apos;s Host
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            The perfect platform to organize and manage your events. Create
            parties, invite guests, and keep track of who&apos;s hosting what -
            all in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-8 rounded-md transition-colors duration-200 text-lg"
            >
              Already a User? Log In
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Create Events
            </h3>
            <p className="text-gray-600">
              Easily create and organize events of any size. Set dates,
              locations, and all the important details.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Manage Guests
            </h3>
            <p className="text-gray-600">
              Keep track of who&apos;s coming and who&apos;s hosting. Send
              invitations and manage RSVPs effortlessly.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Stay Connected
            </h3>
            <p className="text-gray-600">
              Keep everyone in the loop with real-time updates and notifications
              about your events.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
