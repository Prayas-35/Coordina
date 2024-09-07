"use client";

import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Plus, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdTrash } from "react-icons/io";
import Link from 'next/link';
import NavBar from '@/components/functions/NavBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function WardProjectDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([
    { id: '1', name: 'Road Repair', wardNumber: '12', date: new Date(2024, 8, 2, 0, 0), time: '00:00', duration: 1, location: 'Main Street', supervision: 'Mr. A', resources: 'Equipment' },
    { id: '2', name: 'Park Cleanup', wardNumber: '5', date: new Date(2024, 8, 3, 2, 0), time: '02:00', duration: 2, location: 'Central Park', supervision: 'Mr. B', resources: 'Volunteers' },
    { id: '3', name: 'Bridge Maintenance', wardNumber: '7', date: new Date(2024, 8, 4, 3, 0), time: '03:00', duration: 1, location: 'River Road', supervision: 'Mr. C', resources: 'Tools' },
  ]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '', wardNumber: '', date: new Date(), time: '', duration: 1, location: '', supervision: '', resources: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const handleDateTimeClick = (date, time) => {
    const projectsForSlot = getProjectsForDateTime(date, time);
  
    if (projectsForSlot.length > 0) {
      setSelectedProject(projectsForSlot[0]);
      setIsDialogOpen(true);
    } else {
      const dateTime = new Date(date);
      dateTime.setHours(parseInt(time.split(':')[0]), 0, 0, 0);
      setSelectedDateTime(dateTime);
      setNewProject(prev => ({ ...prev, date: dateTime, time }));
      setSelectedProject(null);
      setIsDialogOpen(true);
    }
  };

  const handleAddProject = () => {
    const newProjectEndTime = new Date(newProject.date);
    newProjectEndTime.setHours(newProjectEndTime.getHours() + newProject.duration);

    const isSlotTaken = projects.some((project) => {
      const projectEndTime = new Date(project.date);
      projectEndTime.setHours(projectEndTime.getHours() + project.duration);

      return (
        isSameDay(project.date, newProject.date) &&
        (newProject.date < projectEndTime && newProjectEndTime > project.date)
      );
    });

    if (isSlotTaken) {
      alert('This time slot is already taken. Please choose another.');
      return;
    }

    if (newProject.name && newProject.wardNumber && newProject.date) {
      const projectWithId = { ...newProject, id: Math.random().toString(36).substr(2, 9) };
      setProjects([...projects, projectWithId]);
      setNewProject({
        name: '', wardNumber: '', date: new Date(), time: '', duration: 1, location: '', supervision: '', resources: ''
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  const filteredProjects = searchTerm ? projects.filter(p => p.wardNumber.includes(searchTerm)) : projects;

  const getProjectsForDateTime = (date, time) => {
    return filteredProjects.filter(p => isSameDay(p.date, date) && p.time === time);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <NavBar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <header className="bg-background p-4 sm:p-6 sticky top-[70px] z-10">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-auto order-2 sm:order-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ward number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-input text-foreground border-input focus:ring-primary"
              />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 order-1 pb-5 md:pb-0 sm:order-2 w-full sm:w-auto justify-center">
              <Button variant="outline" onClick={handlePrevWeek}>
                <ChevronLeft className="mr-1 sm:mr-2" /> Prev
              </Button>
              <h2 className="text-lg sm:text-2xl font-semibold whitespace-nowrap">
                {format(currentDate, 'MMM yyyy')}
              </h2>
              <Button variant="outline" onClick={handleNextWeek}>
                Next <ChevronRight className="ml-1 sm:ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>
  
      <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(24,1fr)] gap-px bg-border border-2 rounded-lg overflow-hidden">
            <div className="bg-background p-1 sm:p-2"></div>
            {weekDays.map((day, index) => (
              <div key={index} className={`p-1 sm:p-3 text-center bg-card ${format(day, 'eeee') === 'Sunday' ? 'text-primary' : ''}`}>
                <div className="text-xs sm:text-sm font-medium">{format(day, 'EEE')}</div>
                <div className="text-sm sm:text-2xl font-bold">{format(day, 'dd')}</div>
              </div>
            ))}
  
            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={time}>
                <div className="p-1 sm:p-3 text-right text-sm sm:text-xl text-foreground bg-card">{time}</div>
                {weekDays.map((day, dayIndex) => {
                  const projectsForSlot = getProjectsForDateTime(day, time);
                  return (
                    <div
                      key={`${dayIndex}-${timeIndex}`}
                      className="border-[#7c4da3a3] border relative transition-colors duration-200"
                      onClick={() => handleDateTimeClick(day, time)}
                    >
                      {projectsForSlot.map((project) => (
                        <div
                          key={project.id}
                          className="bg-[#c494eb] p-1 sm:p-2 text-xs overflow-hidden rounded-lg relative"
                          style={{ height: `${(project.duration - 1) * 101.25 + 100}%`, minHeight: '100%' }}
                        >
                          <div className="text-sm sm:text-xl text-black font-medium p-1 text-wrap leading-tight pr-6">{project.name}</div>
                          <div className="text-xs sm:text-lg text-black font-medium text-wrap p-1 leading-tight">
                            Ward {project.wardNumber}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="absolute right-1 top-1 sm:right-2 sm:top-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                            aria-label="Delete project"
                          >
                            <IoMdTrash size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
  
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-background text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {selectedProject ? selectedProject.name : 'Add New Project'}
            </DialogTitle>
            {!selectedProject && selectedDateTime && (
              <p className="text-sm text-muted-foreground">
                {format(selectedDateTime, 'MMMM d, yyyy HH:mm')}
              </p>
            )}
          </DialogHeader>
          {!selectedProject ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectName" className="text-right">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wardNumber" className="text-right">Ward Number</Label>
                  <Input
                    id="wardNumber"
                    value={newProject.wardNumber}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, wardNumber: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newProject.duration}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, location: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supervision" className="text-right">Supervision</Label>
                  <Input
                    id="supervision"
                    value={newProject.supervision}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, supervision: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resources" className="text-right">Resources</Label>
                  <Input
                    id="resources"
                    value={newProject.resources}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, resources: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddProject}>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <p><strong>Ward Number:</strong> {selectedProject.wardNumber}</p>
                <p><strong>Date:</strong> {format(selectedProject.date, 'MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedProject.time}</p>
                <p><strong>Duration:</strong> {selectedProject.duration} hour(s)</p>
                <p><strong>Location:</strong> {selectedProject.location}</p>
                <p><strong>Supervision:</strong> {selectedProject.supervision}</p>
                <p><strong>Resources:</strong> {selectedProject.resources}</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCloseDialog}>
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}