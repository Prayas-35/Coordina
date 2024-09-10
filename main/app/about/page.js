"use client";

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import Link from 'next/link'

// Define the Header component
const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className={`fixed w-full z-50 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
            <img src={isDarkMode ? "Logo6.png" : "Logo6 dark.png"} className="h-5 w-5 sm:h-10 sm:w-10 mr-2" />
            </Link>
            <Link href="/" className={`text-lg sm:text-xl font-bold relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              CitySync
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                Home
              </Button>
            </Link>
            <Link href="/team" passHref>
              <Button variant="ghost" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                Our Team
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="ghost" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                Contact
              </Button>
            </Link>
            <Button variant="ghost" onClick={toggleDarkMode} className={isDarkMode ? 'text-white' : 'text-gray-700'}>
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[hsl(0,0%,100%)] text-gray-900'} transition-colors duration-300`}>
        {/* Welcome Section */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 bg-cover bg-[url('../public/city.jpg')] bg-center"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">CitySync</span>.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">Transforming India's Cities For A Smarter Tomorrow!</p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white">Get Started</Button>
              {/* <Button size="lg" variant="outline" className="font-semibold text-white border-white hover:bg-white hover:text-gray-900">Go to Dashboard</Button> */}
            </div>
          </div>
        </section>

        {/* What we offer Section */}
        <section className={`py-18 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-4xl font-bold text-center mb-12 pt-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What we offer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12">
              {[
                {
                  title: "Dashboard",
                  description: "A comprehensive overview of all city projects and events, providing real-time updates and analytics for efficient management."
                },
                {
                  title: "Resources",
                  description: "A centralized platform for 3rd party vendors and users to access and manage resources required for various urban development projects."
                },
                {
                  title: "Conflicts",
                  description: "An intelligent system that detects and alerts about overlapping projects, ensuring smooth coordination and preventing potential issues."
                },
                {
                  title: "Discussion Forum",
                  description: "A collaborative space for different departments to communicate, share ideas, and solve problems collectively."
                }
              ].map((feature, index) => (
                <GlowingCard key={index} title={feature.title} description={feature.description} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </section>

        {/* Why choose CitySync Section */}
        <section className={`py-18 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-4xl font-bold text-center mb-12 pt-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Why choose us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {[
                {
                  title: "Simplified collaboration",
                  description: "Digital platform for inter-departmental collaboration, centralizing and sharing data."
                },
                {
                  title: "Conflict Resolution",
                  description: "Preventing project conflicts by detecting overlaps and resolving them in real time."
                },
                {
                  title: "Increased efficiency",
                  description: "Improves efficiency, and optimizes resources across urban governance departments."
                },
                {
                  title: "Real-time conflict resolution",
                  description: "RAG chatbot resolves conflicts in real time, ensuring smooth project execution."
                },
                {
                  title: "Blockchain Integration",
                  description: "Automates agreements through smart contracts for trust and transparency."
                },
                {
                  title: "Unified Phasing",
                  description: "Enables seamless coordination at shared sites, improving planning and execution."
                }
              ].map((feature, index) => (
                <FeatureCard key={index} title={feature.title} description={feature.description} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </section>

        {/* User Reviews Section */}
        <section className={`py-18 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-4xl font-bold text-center mb-12 pt-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What our users say?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
              {[
                { name: "John Doe", role: "City Planner", review: "CitySync has revolutionized our urban planning process! The integrated approach to project management has significantly reduced conflicts and improved our overall efficiency." },
                { name: "Jane Smith", role: "Project Manager", review: "The conflict resolution feature saved us from major setbacks. It's like having an extra team member always on the lookout for potential issues." },
                { name: "Raj Patel", role: "Department Head", review: "Interdepartmental collaboration has never been easier. CitySync has broken down silos and fostered a culture of cooperation that's transforming our city." }
              ].map((review, index) => (
                <ReviewCard key={index} {...review} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function GlowingCard({ title, description, isDarkMode }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Card className={`relative p-6 h-full flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
      </Card>
    </div>
  )
}

function FeatureCard({ title, description, isDarkMode }) {
  return (
    <Card className={`p-6 h-full flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">{title}</h3>
      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
    </Card>
  )
}

function ReviewCard({ name, role, review, isDarkMode }) {
  return (
    <Card className={`p-6 h-full flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <p className={`flex-grow mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{review}"</p>
      <div>
        <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">{name}</p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{role}</p>
      </div>
    </Card>
  )
}

