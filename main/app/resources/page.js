"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBrandTabler, IconUserBolt, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/functions/NavBar";
import { useOutsideClick } from "@/hooks/use-outside-click";

const allResourcesData = [
  { id: 1, name: "AI Development Kit", description: "Cutting-edge tools for AI integration", priority: "High", category: "Development", src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "UX Design Masterclass", description: "Comprehensive course on modern UX principles", priority: "Medium", category: "Design", src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064&auto=format&fit=crop" },
  { id: 3, name: "Growth Hacking Strategies", description: "Innovative marketing techniques for rapid growth", priority: "Low", category: "Marketing", src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" },
  { id: 4, name: "Quantum Computing Basics", description: "Introduction to quantum computing principles", priority: "High", category: "Research", src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, name: "Sustainable Tech Practices", description: "Implementing eco-friendly tech solutions", priority: "Medium", category: "Sustainability", src: "https://images.unsplash.com/photo-1473893604213-3df9c15611c0?q=80&w=2071&auto=format&fit=crop" },
];

const myResourcesData = [
  { id: 1, name: "Personal AI Assistant", description: "Customized AI for personal productivity", priority: "High", category: "Personal", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Team Collaboration Tool", description: "Enhanced platform for remote team synergy", priority: "Medium", category: "Work", src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Blockchain Project Manager", description: "Specialized tool for managing blockchain projects", priority: "High", category: "Development", src: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop" },
];

export default function ResourcesPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [resources, setResources] = useState(allResourcesData);
  const [heading, setHeading] = useState("All Requested Resources");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (activeTab === "all") {
      setHeading("All Requested Resources");
      setResources(allResourcesData);
    } else if (activeTab === "my") {
      setHeading("My Requested Resources");
      setResources(myResourcesData);
    }
    setCurrentIndex(0);
  }, [activeTab]);

  useOutsideClick(sidebarRef, () => {
    if (open) setOpen(false);
  });

  const nextResource = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % resources.length);
  };

  const prevResource = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + resources.length) % resources.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          <motion.div
            ref={sidebarRef}
            initial={{ width: 0 }}
            animate={{ width: open ? "250px" : "60px" }}
            className="bg-gray-800 rounded-l-2xl overflow-hidden"
          >
            <div className="p-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="text-white p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {open ? <IconChevronLeft /> : <IconChevronRight />}
              </motion.button>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <SidebarButton
                icon={<IconBrandTabler />}
                text="All Resources"
                isActive={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                open={open}
              />
              <SidebarButton
                icon={<IconUserBolt />}
                text="My Resources"
                isActive={activeTab === "my"}
                onClick={() => setActiveTab("my")}
                open={open}
              />
            </div>
          </motion.div>
          <div className="flex-1 ml-4">
            <h1 className="text-4xl font-bold mb-8">{heading}</h1>
            <div className="relative h-[600px] bg-gray-700 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute inset-0"
                >
                  <ResourceCard resource={resources[currentIndex]} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevResource}
                  className="p-2 bg-white text-gray-800 rounded-full"
                >
                  <IconChevronLeft />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextResource}
                  className="p-2 bg-white text-gray-800 rounded-full"
                >
                  <IconChevronRight />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SidebarButton = ({ icon, text, isActive, onClick, open }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-lg transition-colors",
      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
    )}
  >
    {icon}
    <AnimatePresence>
      {open && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          className="text-sm whitespace-nowrap overflow-hidden"
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

const ResourceCard = ({ resource }) => {
  return (
    <div className="h-full w-full p-8 flex flex-col justify-end bg-cover bg-center" style={{ backgroundImage: `url(${resource.src})` }}>
      <div className="bg-black bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-2">{resource.name}</h2>
        <p className="text-lg mb-4">{resource.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
            {resource.category}
          </span>
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            resource.priority === "High" ? "bg-red-500" :
            resource.priority === "Medium" ? "bg-yellow-500" :
            "bg-green-500"
          )}>
            {resource.priority} Priority
          </span>
        </div>
      </div>
    </div>
  );
};