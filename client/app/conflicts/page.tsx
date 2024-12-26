'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleIcon, LinkIcon } from 'lucide-react'
import { format } from 'date-fns'
import Navbar from "@/components/functions/NavBar"
import Link from "next/link"

// Define interfaces
interface Conflict {
  id: string;
  title: string;
  description: string;
  status: string;
  relatedProjects: string[];
  discussions: number[];
}

interface Project {
  id: string;
  name: string;
  wardNumber: string;
  date: string;
  status: string;
}

interface Discussion {
  id: number;
  title: string;
  department: string;
  status: string;
  date: string;
  replies: number;
}

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [projects, setProjects] = useState<Project[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conflicts and projects data
  useEffect(() => {
    async function fetchConflictsAndProjects() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/getConflicts');

        if (!response.ok) {
          throw new Error('Failed to fetch conflicts');
        }

        const data = await response.json();

        console.log("Conflicts data:", data);
        // Set projects
        setProjects(data.projects || []);

        // Set conflicts
        setConflicts(data.conflicts || []);

        // Mock discussions for now (you can replace this with actual API call later)
        setDiscussions([
          { id: 1, title: "Conflict Resolution Discussion", department: "Project Management", status: "Open", date: "2023-06-15", replies: 3 },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        setError("Failed to load conflicts");
        setIsLoading(false);
      }
    }

    fetchConflictsAndProjects();
  }, [])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-red-500 hover:bg-red-600"
      case "Pending Resolution":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading conflicts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    return format(new Date(isoString), "MMMM d, yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center justify-center relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">Conflicts Mediation</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conflicts && conflicts.length > 0 ? (
            conflicts.map((conflict) => (
              <Card
                key={conflict.id}
                className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:border-purple-500 hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{conflict.title}</span>
                    <Badge className={`${getStatusColor(conflict.status)} text-white`}>
                      {conflict.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{conflict.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Related Projects:</h4>
                    <ScrollArea className="h-24 rounded-md border p-2 relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                      {conflict.relatedProjects.map((projectId) => {
                        const project = projects.find(p => p.id === projectId)
                        return project ? (
                          <div key={project.id} className="flex items-center space-x-2 mb-2">
                            <LinkIcon className="w-4 h-4" />
                            <p>{project.name} (Ward {project.wardNumber})</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(project.date)}
                            </p>
                          </div>
                        ) : null
                      })}
                    </ScrollArea>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Discussions:</h4>
                    {discussions.length > 0 ? (
                      discussions.map((discussion) => (
                        <div key={discussion.id} className="flex items-center justify-between">
                          <span>{discussion.title}</span>
                          <Badge variant="outline">
                            <MessageCircleIcon className="w-3 h-3 mr-1" />
                            {discussion.replies}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No discussions yet</p>
                    )}
                    <Link href="/discussion">
                      <Button variant="outline" className="w-full mt-2 relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                        View Discussions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-lg text-muted-foreground">
              No conflicts found
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
