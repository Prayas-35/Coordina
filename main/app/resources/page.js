"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconBrandTabler, IconUserBolt, IconChevronLeft } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const allResourcesData = [
  { id: 1, name: "Cement", description: "Needed for construction purposes", priority: "High", category: "Transport", src: "https://www.jkcement.com/wp-content/uploads/2023/07/cement-powder-with-trowel-put-brick-construction-work-768x512-jpg.webp" },
  { id: 2, name: "Solar Panels", description: "Needed for sustainable energy project", priority: "Medium", category: "Electricity", src: "https://www.sunrun.com/sites/default/files/styles/gsc_feature_750x300/public/how-long-do-solar-panels-really-last-opt.jpg?itok=8MGFcQp7" },
  { id: 3, name: "Stainless Steel Pipes", description: "Needed for pipeline installation", priority: "Low", category: "Water Supply", src: "https://www.servicesteel.org/wp-content/uploads/2022/01/shutterstock_1289431369.jpg" },
  { id: 4, name: "Cranes", description: "Needed at construction sites", priority: "High", category: "Transport, Water Supply", src: "https://heavyequipmenttraining.com/wp-content/uploads/2018/12/7-Types-of-Construction-Cranes.jpg" },
  { id: 5, name: "Bulbs", description: "Needed for streetlamps installation project", priority: "Medium", category: "Electricity", src: "https://d2qu5xmcgmzxnb.cloudfront.net/ewogICAgICAgICAgICAgICAgICAgICAgICAiYnVja2V0IjogImZpbGVzLmxici5jbG91ZCIsCiAgICAgICAgICAgICAgICAgICAgICAgICJrZXkiOiAicHVibGljLzIwMjEtMTEvc2h1dHRlcnN0b2NrXzg1MDg2ODQ0LmpwZyIsCiAgICAgICAgICAgICAgICAgICAgICAgICJlZGl0cyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAicmVzaXplIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgIndpZHRoIjogOTQ1LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgImhlaWdodCI6IDUyNiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJmaXQiOiAiY292ZXIiCiAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQ==" },
  { id: 6, name: "Street Signs", description: "Needed for street signage project", priority: "Medium", category: "Transport", src: "https://www.safetysign.com/blog/wp-content/uploads/2017/02/missing-stop-sign.jpg" },

]

const myResourcesData = [
  { id: 1, name: "Solar Panels", description: "Needed for sustainable energy project", priority: "Medium", category: "Electricity", src: "https://www.sunrun.com/sites/default/files/styles/gsc_feature_750x300/public/how-long-do-solar-panels-really-last-opt.jpg?itok=8MGFcQp7" },
  { id: 2, name: "Bulbs", description: "Needed for streetlamps installation project", priority: "Medium", category: "Electricity", src: "https://d2qu5xmcgmzxnb.cloudfront.net/ewogICAgICAgICAgICAgICAgICAgICAgICAiYnVja2V0IjogImZpbGVzLmxici5jbG91ZCIsCiAgICAgICAgICAgICAgICAgICAgICAgICJrZXkiOiAicHVibGljLzIwMjEtMTEvc2h1dHRlcnN0b2NrXzg1MDg2ODQ0LmpwZyIsCiAgICAgICAgICAgICAgICAgICAgICAgICJlZGl0cyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAicmVzaXplIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgIndpZHRoIjogOTQ1LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgImhlaWdodCI6IDUyNiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJmaXQiOiAiY292ZXIiCiAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQ==" },
]

const FocusCards = ({ cards }) => {
  const [focusedIndex, setFocusedIndex] = React.useState(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={cn(
            "relative h-60 bg-gray-800 rounded-xl overflow-hidden cursor-pointer",
            focusedIndex === i ? "md:col-span-3" : ""
          )}
          onClick={() => setFocusedIndex(focusedIndex === i ? null : i)}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${card.src})` }}
            animate={{
              scale: focusedIndex === i ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
            <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-sm text-gray-300 mb-2">{card.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium bg-gray-700 text-white px-2 py-1 rounded-full">
                {card.category}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  card.priority === "High" ? "bg-red-500" :
                  card.priority === "Medium" ? "bg-yellow-500" :
                  "bg-green-500"
                )}
              >
                {card.priority} Priority
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResourcesPage() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [resources, setResources] = useState(allResourcesData)
  const [heading, setHeading] = useState("All Requested Resources")

  useEffect(() => {
    if (activeTab === "all") {
      setHeading("All Requested Resources")
      setResources(allResourcesData)
    } else if (activeTab === "my") {
      setHeading("My Requested Resources")
      setResources(myResourcesData)
    }
  }, [activeTab])

  const cards = resources.map((resource) => ({
    title: resource.name,
    src: resource.src,
    description: resource.description,
    priority: resource.priority,
    category: resource.category,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-background">
        <div className="flex">
          <motion.div
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
                <IconChevronLeft />
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
            <FocusCards cards={cards} />
          </div>
        </div>
      </div>
    </div>
  )
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
)