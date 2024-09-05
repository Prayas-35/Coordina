"use client";

import React, { useState } from 'react'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const WardProjectDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [projects, setProjects] = useState([
    // Demo data
    { id: '1', name: 'Road Repair', wardNumber: '12', date: new Date(2024, 8, 2, 0, 0), time: '00:00', location: 'Main Street', supervision: 'Mr. A', resources: 'Equipment' },
    { id: '2', name: 'Park Cleanup', wardNumber: '5', date: new Date(2024, 8, 3, 2, 0), time: '02:00', location: 'Central Park', supervision: 'Mr. B', resources: 'Volunteers' },
    { id: '3', name: 'Bridge Maintenance', wardNumber: '7', date: new Date(2024, 8, 4, 3, 0), time: '03:00', location: 'River Road', supervision: 'Mr. C', resources: 'Tools' }
  ])
  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newProject, setNewProject] = useState({
    name: '',
    wardNumber: '',
    date: new Date(),
    time: '',
    location: '',
    supervision: '',
    resources: ''
  })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))

  const handleDateTimeClick = (date, time) => {
    const dateTime = new Date(date)
    dateTime.setHours(parseInt(time.split(':')[0]), 0, 0, 0)
    setSelectedDateTime(dateTime)
    setNewProject(prev => ({ ...prev, date: dateTime, time }))
    setIsDialogOpen(true)
  }

  const handleAddProject = () => {
    if (newProject.name && newProject.wardNumber && newProject.date) {
      const projectWithId = {
        ...newProject,
        id: Math.random().toString(36).substr(2, 9)
      }
      setProjects([...projects, projectWithId])
      setNewProject({
        name: '',
        wardNumber: '',
        date: new Date(),
        time: '',
        location: '',
        supervision: '',
        resources: ''
      })
      setIsDialogOpen(false)
    }
  }

  const filteredProjects = searchTerm
    ? projects.filter(p => p.wardNumber.includes(searchTerm))
    : projects

  const getProjectsForDateTime = (date, time) => {
    return filteredProjects.filter(p =>
      isSameDay(p.date, date) && p.time === time
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Ward Project Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by ward number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </header>
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" onClick={handlePrevWeek}><ChevronLeft /></Button>
        <h2 className="text-xl">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button variant="ghost" onClick={handleNextWeek}><ChevronRight /></Button>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(24,1fr)] gap-px bg-gray-700 h-[150vh]">
          <div className="bg-gray-900"></div>
          {weekDays.map((day, index) => (
            <div key={index} className={`p-2 text-center ${format(day, 'eeee') === 'Sunday' ? 'text-blue-400' : ''}`}>
              <div>{format(day, 'EEE')}</div>
              <div className="text-2xl">{format(day, 'dd')}</div>
            </div>
          ))}
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="p-2 text-right text-xs text-gray-400">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const dayTimeProjects = getProjectsForDateTime(day, time)
                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className="border border-gray-600 relative hover:bg-gray-800"
                    onClick={() => handleDateTimeClick(day, time)}
                  >
                    {dayTimeProjects.map((project, index) => (
                      <div
                        key={project.id}
                        className="absolute inset-0 bg-blue-500 bg-opacity-50 p-1 text-xs overflow-hidden"
                        style={{ top: `${(index * 20)}%`, height: '100%' }}
                      >
                        {project.name} (Ward {project.wardNumber})
                      </div>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              Add New Project for {selectedDateTime && format(selectedDateTime, 'MMMM d, yyyy HH:mm')}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">Project Name</Label>
              <Input
                id="projectName"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wardNumber" className="text-right">Ward Number</Label>
              <Input
                id="wardNumber"
                value={newProject.wardNumber}
                onChange={(e) => setNewProject(prev => ({ ...prev, wardNumber: e.target.value }))}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                value={newProject.location}
                onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supervision" className="text-right">Supervision</Label>
              <Input
                id="supervision"
                value={newProject.supervision}
                onChange={(e) => setNewProject(prev => ({ ...prev, supervision: e.target.value }))}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resources" className="text-right">Resources</Label>
              <Input
                id="resources"
                value={newProject.resources}
                onChange={(e) => setNewProject(prev => ({ ...prev, resources: e.target.value }))}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <Button onClick={handleAddProject}>Save Project</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WardProjectDashboard
