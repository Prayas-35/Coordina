"use client";

import { Card } from "@/components/ui/card"
import { ArrowDownIcon } from "lucide-react"
import Header from "@/components/functions/Header";

export default function HomePage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Welcome Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to CitySync</h1>
        <p className="text-xl md:text-2xl mb-8">Transforming India's Cities For A Smarter Tomorrow</p>
        <ArrowDownIcon className="w-8 h-8 animate-bounce" />
      </section>

      {/* What we offer Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What we offer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {["Dashboard", "Resources", "Conflicts", "Discussion Forum"].map((feature, index) => (
            <GlowingCard key={index} title={feature} />
          ))}
        </div>
      </section>

      {/* Why choose CitySync Section */}
      <section className="py-16 px-4 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">Why choose CitySync?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            "Simplified collaboration and sharing hub",
            "Conflict Resolution",
            "Increased efficiency and resource optimization",
            "Real-time conflict resolution",
            "Blockchain Integration",
            "Unified Phasing"
          ].map((feature, index) => (
            <FeatureCard key={index} title={feature} />
          ))}
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What our users say?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { name: "John Doe", role: "City Planner", review: "CitySync has revolutionized our urban planning process!" },
            { name: "Jane Smith", role: "Project Manager", review: "The conflict resolution feature saved us from major setbacks." },
            { name: "Raj Patel", role: "Department Head", review: "Interdepartmental collaboration has never been easier." }
          ].map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </section>
    </div>
    </>
    )
}

function GlowingCard({ title }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Card className="relative bg-black p-6 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p>Experience seamless city management with our {title.toLowerCase()} feature.</p>
      </Card>
    </div>
  )
}

function FeatureCard({ title }) {
  return (
    <Card className="bg-gray-700 p-6 h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>Empowering smart cities with cutting-edge solutions.</p>
    </Card>
  )
}

function ReviewCard({ name, role, review }) {
  return (
    <Card className="bg-gray-700 p-6 h-full flex flex-col">
      <p className="flex-grow mb-4">"{review}"</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </Card>
  )
}
