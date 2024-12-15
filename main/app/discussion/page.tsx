"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MessageCircleIcon, XCircleIcon, CheckCircleIcon, SendIcon } from 'lucide-react';
import Navbar from "@/components/functions/NavBar";
import { useAuth } from "../_contexts/authcontext";
import Murex from "@/components/functions/Murex";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Discussion {
    id: string;
    title: string;
    department: string[];
    status: string;
    date?: string;
    replies: number;
    description?: string;
    relatedProjects: string[];
}

interface Conflict {
    id: string;
    title: string;
    description: string;
    status: string;
    relatedProjects: string[];
    relatedDepartments: string[];
    discussions: number[];
}

interface Project {
    id: string;
    name: string;
    wardNumber: string;
    date: string;
    status: string;
}

const DiscussionForum: React.FC = () => {
    const { token } = useAuth();
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [department, setDepartment] = useState<string>("");
    const [uid, setUid] = useState<string>('');

    // Chat-related states
    const [newMessageText, setNewMessageText] = useState("");
    const discussionId = selectedDiscussion?.id || ""; // Specify the discussion ID
    const messages = useQuery(api.chat.getMessages, { discussionId });
    const sendMessage = useMutation(api.chat.sendMessage);

    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Ref for scrollable area
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    function scrollToBottom() {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (selectedDiscussion) {
            scrollToBottom();
        }
    }, [selectedDiscussion, messages]);

    const convertConflictsToDiscussions = (conflicts: Conflict[], userUid: string): Discussion[] => {
        return conflicts
            .filter(conflict => conflict.relatedDepartments.includes(userUid))
            .map(conflict => ({
                id: conflict.id,
                title: conflict.title,
                department: conflict.relatedDepartments,
                status: conflict.status,
                description: conflict.description,
                relatedProjects: conflict.relatedProjects,
                replies: conflict.discussions ? conflict.discussions.length : 0,
                date: new Date().toISOString().split('T')[0] // Use current date as fallback
            }));
    };

    useEffect(() => {
        async function fetchConflictsAndProjects() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/getConflicts');

                if (!response.ok) {
                    throw new Error('Failed to fetch conflicts');
                }

                const data = await response.json();

                setProjects(data.projects || []);
                setConflicts(data.conflicts || []);

                if (uid) {
                    const convertedDiscussions = convertConflictsToDiscussions(data.conflicts || [], uid);
                    setDiscussions(convertedDiscussions);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching conflicts:", error);
                setError("Failed to load conflicts");
                setIsLoading(false);
            }
        }

        fetchConflictsAndProjects();
    }, [uid]);

    useEffect(() => {
        const fetchDepartments = async (): Promise<void> => {
            try {
                const response = await fetch("/api/getName", {
                    headers: {
                        Authorization: token as string,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartment(data.department);
                    setUid(data.uid)
                } else {
                    console.error("Failed to fetch department name");
                }
            } catch (error) {
                console.error("Failed to fetch department name", error);
            }
        };
        if (token) {
            fetchDepartments();
        }
    }, [token]);

    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const handleStatus = () => {
        if (selectedDiscussion) {
            const updatedDiscussions = discussions.map((discussion) => {
                if (discussion.id === selectedDiscussion.id) {
                    return {
                        ...discussion,
                        status: discussion.status === "Active" ? "Resolved" as const : "Open" as const,
                    };
                }
                return discussion;
            });

            setDiscussions(updatedDiscussions);
            setSelectedDiscussion((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: prev.status === "Active" ? "Resolved" : "Open",
                };
            });
        }
    };

    // Chat message sending handler
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newMessageText.trim()) {
            await sendMessage({
                user: uid,
                body: newMessageText,
                discussionId: selectedDiscussion?.id as string// Optional: link message to specific discussion
            });
            setNewMessageText("");
        }
        else {
            console.log("Not allowed");
        }
    };

    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-pink-600 to-pink-500 py-4">
                    Discussion Forum
                </h1>

                <div className="space-y-4 mt-4">
                    {discussions.map((discussion) => (
                        <div key={discussion.id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{discussion.title}</h3>
                                <p className="text-sm text-gray-500">{discussion.department.map(
                                    (id) => `${id.slice(0, 3)}...${id.slice(-3)}`
                                ).join(', ')} • {discussion.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant={discussion.status === "Active" ? "default" : "secondary"}>{discussion.status}</Badge>
                                <Badge variant="outline">
                                    <MessageCircleIcon className="w-3 h-3 mr-1" />
                                    {discussion.replies}
                                </Badge>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => {
                                            setSelectedDiscussion(discussion);
                                            // Add a small timeout to ensure DOM is updated before scrolling
                                            setTimeout(scrollToBottom, 100);
                                        }}>View</Button>


                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>{selectedDiscussion?.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-500">{selectedDiscussion?.date}</span>
                                                </div>
                                            </div>
                                            <ScrollArea ref={scrollAreaRef} className="h-[400px] mb-4 border-b pb-4">
                                                <p className="mb-4">{selectedDiscussion?.description}</p>

                                                {/* Chat Messages Section */}
                                                <div className="space-y-4 px-5">
                                                    {messages?.map((message) => (
                                                        <div
                                                            key={message._id}
                                                            className={`border-t pt-4 ${message.user === uid ? 'text-right' : 'text-left'}`}
                                                        >
                                                            <div className={`flex items-center space-x-2 mb-2 ${message.user === uid ? 'justify-end' : 'justify-start'}`}>
                                                                <Avatar>
                                                                    <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-semibold">{`${message.user.slice(0, 5)}...${message.user.slice(-5)}`}</p>
                                                                </div>
                                                            </div>
                                                            <p
                                                                className={`inline-block p-2 rounded-lg ${message.user === uid
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-gray-200 text-black'
                                                                    }`}
                                                            >
                                                                {message.body}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div ref={messagesEndRef} />
                                            </ScrollArea>
                                            <form onSubmit={handleSendMessage} className="space-y-4">
                                                <div className="flex space-x-2">
                                                    <input
                                                        value={newMessageText}
                                                        onChange={(e) => setNewMessageText(e.target.value)}
                                                        placeholder="Type your reply here..."
                                                        className="flex-grow border rounded-lg p-2"
                                                    />
                                                    <Button type="submit" disabled={!newMessageText.trim()}>
                                                        <SendIcon className="w-4 h-4 mr-2" /> Send
                                                    </Button>
                                                </div>
                                                <div className="flex justify-between">
                                                    <Button variant="outline" onClick={handleStatus}>
                                                        {selectedDiscussion?.status === "Active" ? (
                                                            <>
                                                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                                                Mark as Resolved
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircleIcon className="w-4 h-4 mr-2" />
                                                                Mark as Active
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

            <Murex />
        </>
    );
};

export default DiscussionForum;