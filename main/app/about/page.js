"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/functions/Header";
import { Faq } from "@/components/functions/Faq";
import { Contact } from "@/components/functions/Contact";
import Link from "next/link";

export default function HomePage() {
  useEffect(() => {
    // Ensuring smooth scroll on mount if the URL contains a hash
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="scroll-smooth scroll-m-2">
      <Header />

      <div className="min-h-screen bg-[hsl(0,0%,100%)] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Welcome Section */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 bg-cover bg-[url('../public/whitecity2.jpg')] dark:bg-[url('../public/city.jpg')] bg-center"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                Coordina
              </span>
              .
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Transforming India&apos;s Cities For A Smarter Tomorrow!
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="#offer" scroll={false}>
                <Button
                  size="lg"
                  className="font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white text-lg py-4 px-8"
                  onClick={() => {
                    const offerSection = document.getElementById("offer");
                    if (offerSection) {
                      offerSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What we offer Section */}
        <section className="py-18 px-4 bg-white dark:bg-gray-800 scroll-mt-16" id="offer">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 pt-10 text-gray-900 dark:text-white">
              What we offer?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12">
              {[
                {
                  title: "Dashboard",
                  description:
                    "A comprehensive overview of all city projects and events, providing real-time updates and analytics for efficient management.",
                },
                {
                  title: "Resources",
                  description:
                    "A centralized platform for 3rd party vendors and users to access and manage resources required for various urban development projects.",
                },
                {
                  title: "Conflicts",
                  description:
                    "An intelligent system that detects and alerts about overlapping projects, ensuring smooth coordination and preventing potential issues.",
                },
                {
                  title: "Discussion Forum",
                  description:
                    "A collaborative space for different departments to communicate, share ideas, and solve problems collectively.",
                },
              ].map((feature, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <Card className="relative p-6 h-full flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose Coordina Section */}
        <section className="py-18 px-4 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 pt-10 text-gray-900 dark:text-white">
              Why choose us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {[
                {
                  title: "Simplified collaboration",
                  description:
                    "Digital platform for inter-departmental collaboration, centralizing and sharing data.",
                },
                {
                  title: "Conflict Resolution",
                  description:
                    "Preventing project conflicts by detecting overlaps and resolving them in real time.",
                },
                {
                  title: "Increased efficiency",
                  description:
                    "Improves efficiency, and optimizes resources across urban governance departments.",
                },
                {
                  title: "Real-time conflict resolution",
                  description:
                    "RAG chatbot resolves conflicts in real time, ensuring smooth project execution.",
                },
                {
                  title: "Blockchain Integration",
                  description:
                    "Automates agreements through smart contracts for trust and transparency.",
                },
                {
                  title: "Unified Phasing",
                  description:
                    "Enables seamless coordination at shared sites, improving planning and execution.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 h-full flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800"
                >
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* User Reviews Section */}
        <section className="py-18 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 pt-10 text-gray-900 dark:text-white">
              What our users say?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
              {[
                {
                  name: "John Doe",
                  role: "City Planner",
                  review:
                    "Coordina has revolutionized our urban planning process! The integrated approach to project management has significantly reduced conflicts and improved our overall efficiency.",
                },
                {
                  name: "Jane Smith",
                  role: "Project Manager",
                  review:
                    "The conflict resolution feature saved us from major setbacks. It's like having an extra team member always on the lookout for potential issues.",
                },
                {
                  name: "Raj Patel",
                  role: "Department Head",
                  review:
                    "Interdepartmental collaboration has never been easier. Coordina has broken down silos and fostered a culture of cooperation that's transforming our city.",
                },
              ].map((review, index) => (
                <Card
                  key={index}
                  className="p-6 h-full flex flex-col bg-white dark:bg-gray-800"
                >
                  <p className="flex-grow mb-4 text-gray-600 dark:text-gray-300">
                    &quot;{review.review}&quot;
                  </p>
                  <div>
                    <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {review.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="faq">
          <Faq />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </div>
    </div>
  );
}
