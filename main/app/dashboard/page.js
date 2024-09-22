"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parse, getWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Plus, Menu, Edit, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoMdTrash } from "react-icons/io";
import NavBar from '@/components/functions/NavBar';
import { useAuth } from '../_contexts/authcontext';
import 'react-datepicker/dist/react-datepicker.css';

export default function WardProjectDashboard() {
  const { token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([]);

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '', wardNumber: '', date: new Date(), time: '', duration: 1, location: '', supervision: '', resources: '', status: 'not-started'
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isWeekPickerOpen, setIsWeekPickerOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const handleDateTimeClick = (date, time) => {
    const projectsForSlot = getProjectsForDateTime(date, time);

    if (projectsForSlot.length > 0) {
      setSelectedProject(projectsForSlot[0]);
      setIsEditing(false);
      setIsDialogOpen(true);
    } else {
      const dateTime = new Date(date);
      dateTime.setHours(parseInt(time.split(':')[0]), 0, 0, 0);
      setSelectedDateTime(dateTime);
      setNewProject(prev => ({ ...prev, date: dateTime, time }));
      setSelectedProject(null);
      setIsEditing(false);
      setIsDialogOpen(true);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/getProject', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched projects:', data);
        setProjects(prevProjects => {
          const newProjects = JSON.stringify(data) !== JSON.stringify(prevProjects) ? data : prevProjects;
          return newProjects;
        });
      } else {
        console.error('Failed to fetch projects:', response.status);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProjects();
    }, 60000); // Refetch every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleAddProject = async () => {
    const newProjectEndTime = new Date(newProject.date);
    newProjectEndTime.setHours(newProjectEndTime.getHours() + newProject.duration);

    // const isSlotTaken = projects.some((project) => {
    //   const projectEndTime = new Date(project.date);
    //   projectEndTime.setHours(projectEndTime.getHours() + project.duration);

    //   return (
    //     isSameDay(project.date, newProject.date) &&
    //     (newProject.date < projectEndTime && newProjectEndTime > project.date)
    //   );
    // });

    // if (isSlotTaken) {
    //   alert('This time slot is already taken. Please choose another.');
    //   return;
    // }

    if (newProject.name && newProject.wardNumber && newProject.date) {
      try {
        // Send data to the backend
        const response = await fetch('/api/addProject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // include token for authentication
          },
          body: JSON.stringify(newProject),
        });

        if (response.ok) {
          const addedProject = await response.json();
          // Update the local project state
          setProjects([...projects, addedProject]);

          // Reset form fields after adding
          setNewProject({
            name: '',
            wardNumber: '',
            date: new Date(),
            time: '',
            duration: 1,
            location: '',
            supervision: '',
            resources: '',
            status: 'not-started',
          });

          setIsDialogOpen(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to add project: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error adding project', error);
        alert('An error occurred while adding the project.');
      }
    }
  };

  // const handleUpdateProject = () => {
  //   setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p));
  //   setIsEditing(false);
  //   setIsDialogOpen(false);
  // };

  const handleUpdateProject = async () => {
    try {
      const response = await fetch('/api/updateProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // include token for authentication
        },
        body: JSON.stringify({ status: selectedProject, id: selectedProject._id }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map(p => p.id === updatedProject._id ? updatedProject : p));
        setIsEditing(false);
        setIsDialogOpen(false);
        fetchProjects();
        console.log('Project updated successfully');
      } else {
        alert('Failed to update the project');
      }
    } catch (error) {
      console.error('Error updating project', error);
      alert('An error occurred while updating the project.');
    }
  };

  const handleDeleteProject = async (id) => {
    console.log('Deleting project:', id);
    try {
      const response = await fetch('/api/deleteProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== id));
        setIsDialogOpen(false);
        fetchProjects();
      } else {
        alert('Failed to delete the project');
      }
    } catch (error) {
      console.error('Error deleting project', error);
      alert('An error occurred while deleting the project.');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
    setIsEditing(false);
  };

  const filteredProjects = searchTerm ? projects.filter(p => p.wardNumber.includes(searchTerm)) : projects;

  const getProjectsForDateTime = (date, time) => {
    return filteredProjects.filter(p => isSameDay(p.date, date) && p.time === time);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not-started':
        return 'bg-red-500';
      case 'working':
        return 'bg-yellow-500';
      case 'finished':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleWeekChange = (date) => {
    setCurrentDate(date);
    setIsWeekPickerOpen(false);
  };

  const generateWeekOptions = () => {
    const options = [];
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    for (let week = 1; week <= 52; week++) {
      const weekStart = addWeeks(startDate, week - 1);
      const weekEnd = addDays(weekStart, 6);
      options.push(
        <SelectItem key={week} value={week.toString()}>
          Week {week}: {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
        </SelectItem>
      );
    }
    return options;
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
              {/* current month */}
              <span className="text-lg sm:text-xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 order-1 pb-5 md:pb-0 sm:order-2 w-full sm:w-auto justify-center">
              <Button variant="outline" onClick={handlePrevWeek}>
                <ChevronLeft className="mr-1 sm:mr-2" /> Prev
              </Button>
              <Popover open={isWeekPickerOpen} onOpenChange={setIsWeekPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[150px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Week {getWeek(currentDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Select
                    value={getWeek(currentDate).toString()}
                    onValueChange={(value) => handleWeekChange(addWeeks(new Date(currentDate.getFullYear(), 0, 1), parseInt(value) - 1))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateWeekOptions()}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
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
                          className={`${getStatusColor(project.status)} p-1 sm:p-2 text-xs overflow-hidden rounded-lg relative`}
                          style={{ height: `${(project.duration - 1) * 101.25 + 100}%`, minHeight: '100%' }}
                        >
                          <div className="text-sm sm:text-xl text-white font-medium p-1 text-wrap leading-tight pr-6">{project.name}</div>
                          <div className="text-xs sm:text-lg text-white font-medium text-wrap p-1 leading-tight">
                            Ward {project.wardNumber}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project._id);
                            }}
                            className="absolute right-1 top-1 sm:right-2 sm:top-2 text-white hover:text-red-200 transition-colors duration-200"
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
              {selectedProject ? (isEditing ? 'Edit Project' : selectedProject.name) : 'Add New Project'}
            </DialogTitle>
            {!selectedProject && selectedDateTime && (
              <p className="text-sm text-muted-foreground">
                {format(selectedDateTime, 'MMMM d, yyyy HH:mm')}
              </p>
            )}
          </DialogHeader>
          {!selectedProject || isEditing ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectName" className="text-right">Project Name</Label>
                  <Input
                    id="projectName"
                    value={selectedProject ? selectedProject.name : newProject.name}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, name: e.target.value }) : setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wardNumber" className="text-right">Ward Number</Label>
                  <Input
                    type="number" min="1"
                    id="wardNumber"
                    value={selectedProject ? selectedProject.wardNumber : newProject.wardNumber}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, wardNumber: e.target.value }) : setNewProject((prev) => ({ ...prev, wardNumber: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number" min="1"
                    value={selectedProject ? selectedProject.duration : newProject.duration}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, duration: parseInt(e.target.value) }) : setNewProject((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    value={selectedProject ? selectedProject.location : newProject.location}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, location: e.target.value }) : setNewProject((prev) => ({ ...prev, location: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supervision" className="text-right">Supervision</Label>
                  <Input
                    id="supervision"
                    value={selectedProject ? selectedProject.supervision : newProject.supervision}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, supervision: e.target.value }) : setNewProject((prev) => ({ ...prev, supervision: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resources" className="text-right">Resources</Label>
                  <Input
                    id="resources"
                    value={selectedProject ? selectedProject.resources : newProject.resources}
                    onChange={(e) => selectedProject ? setSelectedProject({ ...selectedProject, resources: e.target.value }) : setNewProject((prev) => ({ ...prev, resources: e.target.value }))}
                    className="col-span-3 bg-input border-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={selectedProject ? selectedProject.status : newProject.status}
                    onValueChange={(value) => selectedProject ? setSelectedProject({ ...selectedProject, status: value }) : setNewProject((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={selectedProject ? handleUpdateProject : handleAddProject}>
                {selectedProject ? 'Update Project' : 'Add Project'}
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
                <p><strong>Department:</strong> {selectedProject.department}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusColor(selectedProject.status)} text-white`}>{selectedProject.status}</span></p>
              </div>
              <div className="flex space-x-4">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleCloseDialog}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}