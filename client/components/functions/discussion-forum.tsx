"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/app/_contexts/authcontext";

export function DiscussionForum({ proposalId }: { proposalId: string }) {
  const { token } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [uid, setUid] = useState("");
  const sendMessage = useMutation(api.chat.sendMessage);
  const [department, setDepartment] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages for the specific proposal
  const messages = useQuery(
    api.chat.getMessages,
    proposalId ? { discussionId: proposalId } : "skip"
  );

  // useEffect(() => {
  //   if (scrollAreaRef.current) {
  //     scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  //   }
  // }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      // Use scrollIntoView specifically on the scroll area
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          console.log(data);
          setDepartment(data.department);
          setUid(data.uid);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() && proposalId) {
      await sendMessage({
        user: uid,
        body: newMessage,
        discussionId: proposalId,
      });
      setNewMessage("");
    } else {
      console.log("Not allowed");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Discussion Forum</CardTitle>
      </CardHeader>
      <CardContent>
        {proposalId ? (
          <>
            <ScrollArea ref={scrollAreaRef} className="h-[300px] mb-4">
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message._id}
                    className={`flex gap-3 px-4 ${message.user === uid ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar>
                      <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <div
                        className={`p-3 rounded-lg ${
                          message.user === uid
                            ? "bg-blue-500 text-white self-end"
                            : "bg-gray-200 text-black self-start"
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {/* You might want to format the timestamp if available */}
                        {message.user.slice(0, 5)}...{message.user.slice(-5)}
                      </p>
                    </div>
                    <div ref={messagesEndRef} />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                Send
              </Button>
            </form>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Select a proposal to view and participate in the discussion
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default DiscussionForum;
