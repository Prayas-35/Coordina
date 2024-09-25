"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MessageCircleIcon, XCircleIcon, CheckCircleIcon } from "lucide-react";
import Navbar from "@/components/functions/NavBar";
import { TbMessageChatbot } from "react-icons/tb";

// Mock data for discussions
const mockDiscussions = [
    {
        id: 1,
        title: "Road repair and water pipeline installation conflict",
        department: "Road Department",
        status: "Open",
        date: "2023-06-15",
        replies: 3,
    },
    {
        id: 2,
        title: "Electric pole installation during road widening",
        department: "Electric Department",
        status: "Resolved",
        date: "2023-06-10",
        replies: 5,
    },
    // Add more mock discussions here
];

export default function Component() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [department, setDepartment] = useState("Road Department");
    const [discussions, setDiscussions] = useState(mockDiscussions);
    const [filter, setFilter] = useState("All");
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);

    const filteredDiscussions =
        filter === "All" ? discussions : discussions.filter((d) => d.department === filter);

    const handleCreateDiscussion = (event) => {
        event.preventDefault();

        const title = event.target.title.value;
        const description = event.target.description.value;

        // Create a new discussion object
        const newDiscussion = {
            id: discussions.length + 1, // Generate an ID for the new discussion
            title,
            department,
            status: "Open", // Default status for a new discussion
            date: new Date().toISOString().split("T")[0], // Current date
            replies: 0, // Start with no replies
            description, // Description added
        };

        // Update the discussions state
        setDiscussions((prevDiscussions) => [...prevDiscussions, newDiscussion]);

        // Optionally clear the form or close the dialog after creation
        setIsDialogOpen(false);
        console.log("New discussion created", newDiscussion);
    };

    const handleStatus = () => {
        if (selectedDiscussion) {
            // Update the discussions array
            const updatedDiscussions = discussions.map((discussion) => {
                if (discussion.id === selectedDiscussion.id) {
                    return {
                        ...discussion,
                        status: discussion.status === "Open" ? "Resolved" : "Open", // Toggle the status
                    };
                }
                return discussion;
            });

            // Update discussions state
            setDiscussions(updatedDiscussions);

            // Update selected discussion state with the new status
            setSelectedDiscussion((prev) => ({
                ...prev,
                status: prev.status === "Open" ? "Resolved" : "Open", // Toggle the status for selected discussion
            }));

            console.log(`Discussion status updated to ${selectedDiscussion.status === "Open" ? "Resolved" : "Open"}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-pink-600 to-pink-500 py-4">
                    Discussion Forum
                </h1>

                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <Select onValueChange={setFilter} defaultValue="All">
                        <SelectTrigger className="w-full md:w-[180px] mb-2 md:mb-0">
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Departments</SelectItem>
                            <SelectItem value="Road Department">Road Department</SelectItem>
                            <SelectItem value="Water Department">Water Department</SelectItem>
                            <SelectItem value="Electric Department">Electric Department</SelectItem>
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Create New Discussion</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Discussion</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateDiscussion} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" placeholder="Enter discussion title" required />
                                </div>
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Select defaultValue={department} onValueChange={setDepartment}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Road Department">Road Department</SelectItem>
                                            <SelectItem value="Water Department">Water Department</SelectItem>
                                            <SelectItem value="Electric Department">Electric Department</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Describe the issue or topic" required />
                                </div>
                                <Button type="submit">Create Discussion</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {filteredDiscussions.map((discussion) => (
                        <div key={discussion.id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{discussion.title}</h3>
                                <p className="text-sm text-gray-500">{discussion.department} • {discussion.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant={discussion.status === "Open" ? "default" : "secondary"}>{discussion.status}</Badge>
                                <Badge variant="outline">
                                    <MessageCircleIcon className="w-3 h-3 mr-1" />
                                    {discussion.replies}
                                </Badge>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setSelectedDiscussion(discussion)}>View</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>{selectedDiscussion?.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar>
                                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                                        <AvatarFallback>JD</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">John Doe</p>
                                                        <p className="text-sm text-gray-500">{selectedDiscussion?.department}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-500">{selectedDiscussion?.date}</span>
                                                </div>
                                            </div>
                                            <ScrollArea className="h-[300px] mb-4">
                                                <p className="mb-4">This is the content of the discussion. It would include details about the conflict or issue that needs to be resolved between departments.</p>
                                                {/* Mock replies */}
                                                <div className="space-y-4">
                                                    <div className="border-t pt-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Avatar>
                                                                <AvatarImage src="/placeholder-avatar-2.jpg" />
                                                                <AvatarFallback>JS</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-semibold">Jane Smith</p>
                                                                <p className="text-sm text-gray-500">Water Department</p>
                                                            </div>
                                                        </div>
                                                        <p>This is a reply to the discussion. It would contain suggestions or additional information.</p>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                            <form className="space-y-4">
                                                <Textarea placeholder="Type your reply here..." />
                                                <div className="flex justify-between">
                                                    <Button type="submit">Send Reply</Button>
                                                    <Button variant="outline" onClick={handleStatus}>
                                                        {selectedDiscussion?.status === "Open" ? (
                                                            <>
                                                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                                                Mark as Resolved
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircleIcon className="w-4 h-4 mr-2" />
                                                                Mark as Open
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Button in the bottom-right corner */}
            <div className="fixed bottom-10 right-10">
                <Button
                    className="p-3 rounded-full bg-purple-600 text-white shadow-lg size-16"
                    onClick={() => setIsChatboxOpen(!isChatboxOpen)}
                >
                    <TbMessageChatbot className="size-10 font-black" />
                </Button>
            </div>

            {/* Custom Chatbox */}
            {isChatboxOpen && (
                <div className="fixed bottom-28 right-10 w-[300px] dark:bg-slate-950 bg-white shadow-lg rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Chat with Us</h2>
                        <button
                            onClick={() => setIsChatboxOpen(false)}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="h-[200px] mb-4 p-2 dark:bg-gray-900 bg-gray-100 rounded overflow-y-auto">
                        {/* Chat messages or help text */}
                        <p className="text-sm dark:text-gray-200 text-gray-600">Hello! How can we assist you today?</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Textarea placeholder="Type your message..." className="flex-grow" />
                        <Button className="flex-shrink-0">Send</Button>
                    </div>
                </div>
            )}
        </>
    );
}
