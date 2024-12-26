"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, CalendarIcon, Plus } from 'lucide-react';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Navbar from "@/components/functions/NavBar";
import { format } from "date-fns";

// Define types for the workshop data
interface Workshop {
  _id: string;
  name: string;
  projects: string[];
  department: string;
  date: string;
  time: string;
  link: string;
  status: "Live" | "Upcoming";
}

export default function WorkshopManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formStatus, setFormStatus] = useState<"Live" | "Upcoming">("Upcoming");
  const [formRelatedProjects, setFormRelatedProjects] = useState("");

  // Ref for dialog close button
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const response = await fetch('/api/getAllWS');
      const data = await response.json();
      console.log(data);
      setWorkshops(data);
    };
    fetchWorkshops();
  }, []);

  const formatDate = (isoString: string) => {
    return format(new Date(isoString), "MMMM d, yyyy");
  };

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

  const resetFormFields = () => {
    setFormName("");
    setFormDepartment("");
    setFormDate("");
    setFormTime("");
    setFormLink("");
    setFormStatus("Upcoming");
    setFormRelatedProjects("");
  };

  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectsArray = formRelatedProjects.split(",").map((project) => project.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/addWorkshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          department: formDepartment,
          date: formDate,
          time: formTime,
          duration: 2, // Set duration or fetch it from another input if applicable
          link: formLink,
          status: formStatus,
          projects: projectsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workshop");
      }

      const result = await response.json();
      console.log("Workshop created successfully:", result);

      // Refresh workshops list or add new workshop to state
      const updatedResponse = await fetch('/api/getAllWS');
      const updatedData = await updatedResponse.json();
      setWorkshops(updatedData);

      // Reset form fields
      resetFormFields();

      // Close the dialog
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }
    } catch (error) {
      console.error("Error creating workshop:", error);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="flex-1 p-4 sm:p-6 overflow-auto mx-4 sm:mx-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
            Training and Workshops
          </h1>
        </div>

        {/* Search, Filter, Calendar, and Add Workshop */}
        <div className="flex flex-col sm:flex-row mb-6 gap-4 items-center">
          <div className="flex-1 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-4 items-center">
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-900 dark:text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleCalendarClick} className="flex-shrink-0">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-shrink-0">
                  <Plus className="mr-2 h-4 w-4" /> Add Workshop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workshop</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleWorkshopSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Workshop Name</Label>
                    <Input
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Workshop Link</Label>
                    <Input
                      id="link"
                      type="url"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="relatedProjects">Related Projects (comma-separated)</Label>
                    <Input
                      id="relatedProjects"
                      value={formRelatedProjects}
                      onChange={(e) => setFormRelatedProjects(e.target.value)}
                      placeholder="e.g. Project A, Project B, Project C"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formStatus}
                      onValueChange={(value: "Live" | "Upcoming") => setFormStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DialogClose ref={dialogCloseRef} asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create Workshop</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredWorkshops.map((workshop) => (
            <Card
              key={workshop._id}
              className="bg-white dark:bg-gray-900 shadow-lg w-full"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg sm:text-xl font-bold dark:text-white">
                    {workshop.name}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${workshop.status === "Live"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                      }`}
                  >
                    {workshop.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {workshop.department}
                </p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 dark:text-white">
                    Related Projects:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {workshop.projects.map((project, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 dark:text-gray-300" />
                    <span className="text-sm sm:text-base dark:text-gray-300">{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 dark:text-gray-300" />
                    <span className="text-sm sm:text-base dark:text-gray-300">{workshop.time}</span>
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
    </>
  );
}