"use client";

import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./index.css";

function getOrSetFakeName() {
  // Check if sessionStorage is available (client-side)
  if (typeof sessionStorage !== 'undefined') {
    const NAME_KEY = "tutorial_name";
    const name = sessionStorage.getItem(NAME_KEY);
    if (!name) {
      const newName = faker.person.firstName();
      sessionStorage.setItem(NAME_KEY, newName);
      return newName;
    }
    return name;
  }

  // Fallback for server-side or if sessionStorage is not available
  return faker.person.firstName();
}

export default function App() {
  // Use state to ensure the name is only set client-side
  const [NAME, setNAME] = useState<string>("");

  useEffect(() => {
    // Set the name when component mounts (client-side)
    setNAME(getOrSetFakeName());
  }, []);

  const discussionId = "1"; // Specify the discussion ID
  const messages = useQuery(api.chat.getMessages, { discussionId });
  const sendMessage = useMutation(api.chat.sendMessage);

  const [newMessageText, setNewMessageText] = useState("");

  // Allowed users list
  const allowedUsers = ["Darion", "Alfonzo"];

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    if (messages) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 0);
    }
  }, [messages]);

  // Don't render anything if NAME is not set or not an allowed user
  if (!NAME || !allowedUsers.includes(NAME)) {
    return (
      <main className="chat">
        <header>
          <h1>Access Restricted</h1>
          <p>Only Darion and Alfonzo can access this chat.</p>
        </header>
      </main>
    );
  }

  return (
    <main className="chat">
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{NAME}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.user === NAME ? "message-mine" : ""}
        >
          <div>{message.user}</div>
          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Additional check to prevent unauthorized message sending
          if (allowedUsers.includes(NAME)) {
            await sendMessage({ user: NAME, body: newMessageText, discussionId });
            setNewMessageText("");
          }
        }}
      >
        <input
          value={newMessageText}
          onChange={(e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
        />
        <button
          type="submit"
          disabled={!newMessageText || !allowedUsers.includes(NAME)}
        >
          Send
        </button>
      </form>
    </main>
  );
}
