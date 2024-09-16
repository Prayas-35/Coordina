'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleIcon, LinkIcon } from 'lucide-react'
import { format } from 'date-fns'
import NavBar from '@/components/functions/NavBar';

// Mock data for conflicts
const mockConflicts = [
  {
    id: 1,
    title: "Road repair and water pipeline installation conflict",
    description: "Scheduling conflict between road repair and water pipeline installation in Ward 12",
    status: "Active",
    relatedProjects: ["1", "10"],  // IDs from the projects array
    discussions: [2],  // IDs from the discussions array
  },
  {
    id: 2,
    title: "Tree planting interfering with street light installation",
    description: "Conflict between tree planting initiative and street light installation in Ward 36",
    status: "Pending Resolution",
    relatedProjects: ["24", "4"],
    discussions: [1],
  },
  // Add more mock conflicts here
]

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState(mockConflicts)
  const [projects, setProjects] = useState([])
  const [discussions, setDiscussions] = useState([])

  // Fetch projects and discussions data
  useEffect(() => {
    // In a real application, these would be API calls
    setProjects([
      { id: '1', name: 'Road Repairing', wardNumber: '12', date: new Date(2024, 8, 2) },
      { id: '10', name: 'Water Pipeline Repair', wardNumber: '6', date: new Date(2024, 8, 11) },
      { id: '24', name: 'Tree Planting Initiative', wardNumber: '36', date: new Date(2024, 8, 29) },
      { id: '4', name: 'Street Light Installation', wardNumber: '3', date: new Date(2024, 8, 5) },
    ])
    setDiscussions([
      { id: 1, title: "Electric pole installation during road widening", department: "Electric Department", status: "Resolved", date: "2023-06-10", replies: 5 },
      { id: 2, title: "Road repair and water pipeline installation conflict", department: "Road Department", status: "Open", date: "2023-06-15", replies: 3 },
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-red-500 hover:bg-red-600"
      case "Pending Resolution":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center justify-center relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">Conflicts Mediation</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conflicts.map((conflict) => (
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
                          <span>{project.name} (Ward {project.wardNumber})</span>
                          <span className="text-sm text-muted-foreground">
                            {format(project.date, 'MMM d, yyyy')}
                          </span>
                        </div>
                      ) : null
                    })}
                  </ScrollArea>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Discussions:</h4>
                  {conflict.discussions.map((discussionId) => {
                    const discussion = discussions.find(d => d.id === discussionId)
                    return discussion ? (
                      <div key={discussion.id} className="flex items-center justify-between">
                        <span>{discussion.title}</span>
                        <Badge variant="outline">
                          <MessageCircleIcon className="w-3 h-3 mr-1" />
                          {discussion.replies}
                        </Badge>
                      </div>
                    ) : null
                  })}
                  <Button variant="outline" className="w-full mt-2 relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                    View Discussions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}