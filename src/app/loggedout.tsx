"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, PartyPopper, Music, Gift } from "lucide-react";

export default function LoggedOutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white -mt-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Never Wonder &ldquo;Who&apos;s Hosting?&rdquo; Again
            </h1>

            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              The app that{" "}
              <span className="text-pink-400 font-medium">fairly decides</span>{" "}
              who will host your next party, so everyone takes turns and no one
              feels confused or burdened. Create events, invite friends, and let
              the app pick the perfect host.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 text-lg shadow-lg hover:shadow-pink-500/20"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  <PartyPopper size={20} />
                  Get Started
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white hover:text-pink-300 transition-all duration-200 text-lg rounded-full"
              >
                <Link href="/login">Already a User? Log In</Link>
              </Button>
            </div>

            {/* App explanation illustration */}
            <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 max-w-2xl mx-auto mb-8">
              <h3 className="text-xl font-semibold mb-4 text-pink-300 flex items-center justify-center gap-2">
                <Music size={20} />
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-gray-600">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <p className="text-gray-300">
                    Create a party and invite your friends
                  </p>
                </div>
                <div className="p-4">
                  <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-gray-600">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <p className="text-gray-300">
                    The app selects a host fairly from the group
                  </p>
                </div>
                <div className="p-4">
                  <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-gray-600">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <p className="text-gray-300">
                    Everyone knows who&apos;s hosting - no confusion!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Why Use Who&apos;s Host?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
            <div className="p-6">
              <div className="rounded-full bg-pink-900/30 w-12 h-12 flex items-center justify-center mb-4 border border-pink-800/30">
                <Calendar className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500 transition-all duration-300">
                Fair Host Selection
              </h3>
              <p className="text-gray-300">
                Our algorithm ensures everyone takes turns hosting, tracking
                past events so the same person isn&apos;t always stuck with
                hosting duties.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400" />
            <div className="p-6">
              <div className="rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-4 border border-blue-800/30">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-teal-400 transition-all duration-300">
                Manage Guest Lists
              </h3>
              <p className="text-gray-300">
                Easily invite friends, track RSVPs, and manage who&apos;s
                attending. Everyone stays in the loop with clear roles and
                responsibilities.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="p-6">
              <div className="rounded-full bg-purple-900/30 w-12 h-12 flex items-center justify-center mb-4 border border-purple-800/30">
                <Gift className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300">
                Party Planning Tools
              </h3>
              <p className="text-gray-300">
                Set dates, locations, themes, and keep all your party details
                organized in one place. Never lose track of who&apos;s
                responsible for what.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gray-800/70 p-8 rounded-xl border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Ready to End the &ldquo;Who&apos;s Hosting?&rdquo; Debate?
            </h2>
            <p className="text-gray-300 mb-6">
              Join thousands of friend groups who use Who&apos;s Host to make
              party planning fair and drama-free.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 text-lg shadow-lg hover:shadow-pink-500/20"
            >
              <Link href="/signup" className="flex items-center gap-2">
                <PartyPopper size={20} />
                Start Planning Your Next Party
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
