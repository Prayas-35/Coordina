// Mark this component as a Client Component
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  CheckSquare,
  Menu,
  Calendar as CalendarIcon,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/functions/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for workshops
const workshops = [
  {
    id: 1,
    name: "Eco-Friendly Road Construction",
    projects: ["Road Repair", "Sustainability Initiative"],
    department: "Transportation",
    date: "2024-09-15",
    time: "10:00 AM",
    link: "https://zoom.us/j/123456789",
    status: "Live",
  },
  {
    id: 2,
    name: "Smart Grids System",
    projects: ["Electric lines installation", "Smart City Initiative"],
    department: "Electricity",
    date: "2024-09-10",
    time: "2:00 PM",
    link: "https://zoom.us/j/987654321",
    status: "Upcoming",
  },
];

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      (workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.projects.some((project) =>
          project.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        workshop.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.date.includes(searchTerm)) &&
      (filter === "all" ||
        (filter === "upcoming" && workshop.status === "Upcoming") ||
        (filter === "live" && workshop.status === "Live"))
  );

  const handleCalendarClick = () => {
    console.log("Calendar icon clicked");
    // Add your calendar logic here
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-black-100 dark:bg-black-900 transition-colors duration-200">
        {/* Side Panel */}
        <div
          className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
            isExpanded ? "w-64" : "w-16"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="p-4">
            <Button variant="ghost" className="w-full justify-start mb-4">
              {isExpanded ? <Menu className="mr-2" /> : <Menu />}
              {isExpanded && <span>Menu</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              {isExpanded ? <Users className="mr-2" /> : <Users />}
              {isExpanded && <span>All Workshops</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {isExpanded ? <CheckSquare className="mr-2" /> : <CheckSquare />}
              {isExpanded && <span>Attended Workshops</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="ext-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Training and Workshops Page
            </h1>
            {/* <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button> */}
          </div>

          {/* Search, Filter, and Calendar */}
          <div className="flex mb-6 gap-4 items-center">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-900 dark:text-white"
              />
            </div>
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleCalendarClick}>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Workshop Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="bg-white dark:bg-gray-900 shadow-lg"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold dark:text-white">
                      {workshop.name}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        workshop.status === "Live"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {workshop.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {workshop.department}
                  </p>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 dark:text-white">
                      Related Projects:
                    </h3>
                    {workshop.projects.map((project, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 dark:text-gray-300" />
                      <span className="dark:text-gray-300">
                        {workshop.date}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 dark:text-gray-300" />
                      <span className="dark:text-gray-300">
                        {workshop.time}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <a
                      href={workshop.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Workshop
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
