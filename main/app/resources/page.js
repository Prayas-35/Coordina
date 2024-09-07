"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBrandTabler, IconUserBolt } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Navbar from "@/components/functions/NavBar";

// Sample JSON data for the two tabs
const allResourcesData = [
  { id: 1, name: "Resource 1", description: "Description of resource 1" },
  { id: 2, name: "Resource 2", description: "Description of resource 2" },
  { id: 3, name: "Resource 3", description: "Description of resource 3" },
];

const myResourcesData = [
  { id: 1, name: "My Resource 1", description: "Description of my resource 1" },
  { id: 2, name: "My Resource 2", description: "Description of my resource 2" },
];

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // State to track the active tab
  const [resources, setResources] = useState(allResourcesData); // Default to all resources
  const [heading, setHeading] = useState("All Requested Resources"); // State for the heading

  useEffect(() => {
    // Update the content based on the selected tab
    if (activeTab === "all") {
      setHeading("All Requested Resources");
      setResources(allResourcesData);
    } else if (activeTab === "my") {
      setHeading("My Requested Resources");
      setResources(myResourcesData);
    }
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <div
        className={cn(
          "h-full rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-[100vh]"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-2">
                {/* Tab for All Requested Resources */}
                <button
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    activeTab === "all"
                      ? "text-blue-500 scale-105"
                      : "text-neutral-700 dark:text-neutral-200",
                    open ? "ms-4" : ""
                  )}
                >
                  <IconBrandTabler className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-sm transition duration-150"
                  >
                    All Requested Resources
                  </motion.span>
                </button>

                {/* Tab for My Requested Resources */}
                <button
                  onClick={() => setActiveTab("my")}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    activeTab === "my"
                      ? "text-blue-500 scale-105"
                      : "text-neutral-700 dark:text-neutral-200",
                    open ? "ms-4" : ""
                  )}
                >
                  <IconUserBolt className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-sm transition duration-150"
                  >
                    My Requested Resources
                  </motion.span>
                </button>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <Dashboard resources={resources} heading={heading} />
      </div>
    </>
  );
}

// Dashboard component to display the resources based on the active tab
const Dashboard = ({ resources, heading }) => {
  return (
    <div className="flex flex-1 p-4 bg-background rounded-tl-3xl">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {resources.length > 0 ? heading : "No resources found"}
        </h1>
        <ul className="mt-4">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="border-b border-gray-300 dark:border-gray-600 py-2"
            >
              <h2 className="text-xl text-black dark:text-white">
                {resource.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {resource.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
