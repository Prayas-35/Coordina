"use client";

import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdTrash } from "react-icons/io";

const WardProjectDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([
    { id: '1', name: 'Road Repair', wardNumber: '12', date: new Date(2024, 8, 2, 0, 0), time: '00:00', duration: 1, location: 'Main Street', supervision: 'Mr. A', resources: 'Equipment' },
    { id: '2', name: 'Park Cleanup', wardNumber: '5', date: new Date(2024, 8, 3, 2, 0), time: '02:00', duration: 2, location: 'Central Park', supervision: 'Mr. B', resources: 'Volunteers' },
    { id: '3', name: 'Bridge Maintenance', wardNumber: '7', date: new Date(2024, 8, 4, 3, 0), time: '03:00', duration: 1, location: 'River Road', supervision: 'Mr. C', resources: 'Tools' },
  ]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    name: '', wardNumber: '', date: new Date(), time: '', duration: 1, location: '', supervision: '', resources: ''
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const handleDateTimeClick = (date, time) => {
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(time.split(':')[0]), 0, 0, 0);
    setSelectedDateTime(dateTime);
    setNewProject(prev => ({ ...prev, date: dateTime, time }));
    setIsDialogOpen(true);
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

  const filteredProjects = searchTerm ? projects.filter(p => p.wardNumber.includes(searchTerm)) : projects;

  const getProjectsForDateTime = (date, time) => {
    return filteredProjects.filter(p => isSameDay(p.date, date) && p.time === time);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex justify-between items-center p-6 border-b border-border">
        <h1 className="text-3xl font-bold">Ward Project Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ward number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input text-foreground border-input focus:ring-primary"
            />
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between p-6">
        <Button variant="outline" onClick={handlePrevWeek}><ChevronLeft className="mr-2" /> Previous Week</Button>
        <h2 className="text-2xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button variant="outline" onClick={handleNextWeek}>Next Week <ChevronRight className="ml-2" /></Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(24,1fr)] gap-px bg-border border-2 rounded-lg overflow-hidden">
          <div className="bg-background p-2"></div>
          {weekDays.map((day, index) => (
            <div key={index} className={`p-3 text-center bg-card ${format(day, 'eeee') === 'Sunday' ? 'text-primary' : ''}`}>
              <div className="text-sm font-medium">{format(day, 'EEE')}</div>
              <div className="text-2xl font-bold">{format(day, 'dd')}</div>
            </div>
          ))}

          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="p-3 text-right text-xl text-foreground bg-card">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const projectsForSlot = getProjectsForDateTime(day, time);
                return (
                  <div key={`${dayIndex}-${timeIndex}`} className="border-[#7c4da3a3] border relative transition-colors duration-200" onClick={() => handleDateTimeClick(day, time)}>
                    {projectsForSlot.map((project) => (
                      <div
                        key={project.id}
                        className="bg-[#c494eb] p-2 text-xs overflow-hidden rounded-lg"
                        style={{ height: `${project.duration * 100}%`, minHeight: '100%' }}>
                        <div className="text-xl text-black font-bold p-1 text-wrap leading-normal">{project.name}</div>
                        <div className="text-black font-bold text-lg text-wrap p-1 leading-normal">Ward {project.wardNumber}</div>
                        
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors duration-200">
                            <IoMdTrash size={23} />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Project</DialogTitle>
            <p className="text-muted-foreground">{selectedDateTime && format(selectedDateTime, 'MMMM d, yyyy HH:mm')}</p>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">Project Name</Label>
              <Input
                id="projectName"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wardNumber" className="text-right">Ward Number</Label>
              <Input
                id="wardNumber"
                value={newProject.wardNumber}
                onChange={(e) => setNewProject(prev => ({ ...prev, wardNumber: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                value={newProject.duration}
                onChange={(e) => setNewProject(prev => ({ ...prev, duration: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                value={newProject.location}
                onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supervision" className="text-right">Supervision</Label>
              <Input
                id="supervision"
                value={newProject.supervision}
                onChange={(e) => setNewProject(prev => ({ ...prev, supervision: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resources" className="text-right">Resources</Label>
              <Input
                id="resources"
                value={newProject.resources}
                onChange={(e) => setNewProject(prev => ({ ...prev, resources: e.target.value }))}
                className="col-span-3 bg-input border-input"
              />
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardProjectDashboard;