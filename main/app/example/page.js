'use client';

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/functions/NavBar"

const workshops = [
  {
    id: 1,
    title: 'Construction techniques',
    start: new Date(2024, 8, 24, 2, 0),
    end: new Date(2024, 8, 24, 3, 0),
    project: 'Flyover building',
    department: 'Transportation',
    overview: 'Introduction to React fundamentals',
    link: 'https://zoom.us/j/123456789',
  },
  {
    id: 2,
    title: 'New Website Demonstration',
    start: new Date(2024, 8, 26, 1, 0),
    end: new Date(2024, 8, 26, 3, 0),
    project: 'Management Training',
    department: 'HR',
    overview: 'Basic principles of project management',
    link: 'https://zoom.us/j/987654321',
  },
  {
    id: 3,
    title: 'Data Analysis',
    start: new Date(2024, 8, 28, 1, 0),
    end: new Date(2024, 8, 28, 4, 0),
    project: 'Data Maintainance',
    department: 'IT',
    overview: 'Hands-on session on data analysis techniques',
    link: 'https://zoom.us/j/456789123',
  },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

export default function TrainingWorkshopCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 23)) // September 23, 2024
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWorkshops = workshops.filter(workshop => 
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const getEventPosition = (event) => {
    const startHour = event.start.getHours()
    const endHour = event.end.getHours()
    const dayIndex = weekDates.findIndex(date => date.getDate() === event.start.getDate())
    return { startHour, endHour, dayIndex }
  }

  return (
    
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-2">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search by workshop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white placeholder-gray-400"
          />
        </div>
        <div className="text-2xl font-bold">September 2024</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Week {getWeekNumber(currentDate)}</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-px bg-gray-700">
        <div className="bg-gray-900 h-20"></div>
        {weekDates.map((date, index) => (
          <div key={index} className="bg-gray-900 p-2 text-center h-20">
            <div className="font-medium">{days[index]}</div>
            <div className="text-2xl">{date.getDate()}</div>
          </div>
        ))}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={`hour-${hourIndex}`}>
            <div className="bg-gray-900 p-2 text-right text-sm text-gray-400 h-24">
              {hour}
            </div>
            {weekDates.map((_, dayIndex) => (
              <div key={`cell-${hourIndex}-${dayIndex}`} className="bg-gray-800 relative h-24">
                {filteredWorkshops.map((workshop) => {
                  const { startHour, endHour, dayIndex: eventDayIndex } = getEventPosition(workshop)
                  if (eventDayIndex === dayIndex && startHour <= hourIndex && endHour > hourIndex) {
                    const isStart = startHour === hourIndex
                    const duration = endHour - startHour
                    return (
                      <Dialog key={workshop.id}>
                        <DialogTrigger asChild>
                          <div
                            className={`absolute inset-x-0 bg-purple-500 text-white overflow-hidden cursor-pointer
                              ${isStart ? 'rounded-t-md' : ''}
                              ${hourIndex === endHour - 1 ? 'rounded-b-md' : ''}
                            `}
                            style={{
                              top: isStart ? '0' : '-1px',
                              bottom: hourIndex === endHour - 1 ? '0' : '-1px',
                            }}
                          >
                            {isStart && (
                              <div className="p-2 font-bold truncate">{workshop.title}</div>
                            )}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle>{workshop.title}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="project" className="text-right">Project</Label>
                              <Input id="project" value={workshop.project} className="col-span-3 bg-gray-700" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="department" className="text-right">Department</Label>
                              <Input id="department" value={workshop.department} className="col-span-3 bg-gray-700" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="overview" className="text-right">Overview</Label>
                              <Input id="overview" value={workshop.overview} className="col-span-3 bg-gray-700" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="time" className="text-right">Time</Label>
                              <Input id="time" value={`${workshop.start.toLocaleTimeString()} - ${workshop.end.toLocaleTimeString()}`} className="col-span-3 bg-gray-700" readOnly />
                            </div>
                          </div>
                          <Button asChild>
                            <a href={workshop.link} target="_blank" rel="noopener noreferrer">Join Workshop</a>
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )
                  }
                  return null
                })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}