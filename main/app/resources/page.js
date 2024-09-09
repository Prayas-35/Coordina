'use client'

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconBrandTabler, IconUserBolt, IconChevronLeft, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from '@/components/functions/NavBar';

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

const FocusCards = ({ cards, onEdit, onDelete, showActions }) => {
  const [focusedIndex, setFocusedIndex] = useState(null)

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
            {showActions && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(card)
                  }}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(card.id)
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const AddResourceDialog = ({ isOpen, onClose, onAdd }) => {
  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    priority: "Medium",
    category: "Transport",
    src: "https://via.placeholder.com/300x200"
  })

  const handleAdd = () => {
    onAdd(newResource)
    onClose()
    setNewResource({
      name: "",
      description: "",
      priority: "Medium",
      category: "Transport",
      src: "https://via.placeholder.com/300x200"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              onValueChange={(value) => setNewResource({ ...newResource, priority: value })}
              defaultValue={newResource.priority}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              onValueChange={(value) => setNewResource({ ...newResource, category: value })}
              defaultValue={newResource.category}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleAdd}>Add Resource</Button>
      </DialogContent>
    </Dialog>
  )
}

const EditResourceDialog = ({ isOpen, onClose, onEdit, resource }) => {
  const [editedResource, setEditedResource] = useState(resource || {
    name: "",
    description: "",
    priority: "Medium",
    category: "Electricity",
    src: "https://via.placeholder.com/300x200"
  })

  useEffect(() => {
    if (resource) {
      setEditedResource(resource)
    }
  }, [resource])

  const handleEdit = () => {
    if (resource && resource.id) {
      onEdit(editedResource)
      onClose()
    }
  }

  if (!resource) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedResource.name || ""}
              onChange={(e) => setEditedResource({ ...editedResource, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editedResource.description || ""}
              onChange={(e) => setEditedResource({ ...editedResource, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              onValueChange={(value) => setEditedResource({ ...editedResource, priority: value })}
              defaultValue={editedResource.priority || "Medium"}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              onValueChange={(value) => setEditedResource({ ...editedResource, category: value })}
              defaultValue={editedResource.category || "Transport"}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleEdit}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  )
}

export default function ResourcesPage() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [allResources, setAllResources] = useState(allResourcesData)
  const [myResources, setMyResources] = useState(myResourcesData)
  const [displayedResources, setDisplayedResources] = useState(allResourcesData)
  const [heading, setHeading] = useState("All Requested Resources")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)

  useEffect(() => {
    if (activeTab === "all") {
      setHeading("All Requested Resources")
      setDisplayedResources(allResources)
    } else if (activeTab === "my") {
      setHeading("My Requested Resources")
      setDisplayedResources(myResources)
    }
  }, [activeTab, allResources, myResources])

  const handleAddResource = (newResource) => {
    const id = Math.max(...allResources.map(r => r.id), 0) + 1
    const newResourceWithId = { ...newResource, id }
    setMyResources(prevMyResources => [...prevMyResources, newResourceWithId])
    setAllResources(prevAllResources => [...prevAllResources, newResourceWithId])
  }

  const handleEditResource = (editedResource) => {
    if (editedResource && editedResource.id) {
      setMyResources(prevMyResources =>
        prevMyResources.map(r => r.id === editedResource.id ? editedResource : r)
      )
      setAllResources(prevAllResources =>
        prevAllResources.map(r => r.id === editedResource.id ? editedResource : r)
      )
    }
  }

  const handleDeleteResource = (id) => {
    setMyResources(prevMyResources => prevMyResources.filter(r => r.id !== id))
    setAllResources(prevAllResources => prevAllResources.filter(r => r.id !== id))
  }

  const cards = displayedResources.map((resource) => ({
    id: resource.id,
    title: resource.name,
    src: resource.src,
    description: resource.description,
    priority: resource.priority,
    category: resource.category,
  }))

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-background">
        <div className="flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: open ? "250px" : "60px" }}
            className="bg-gray-800 rounded-l-2xl overflow-hidden"
            onHoverStart={() => setOpen(!open)}
            onHoverEnd={() => setOpen(!open)}
          >
            <div className="p-4">
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
          <div className="flex-1 ml-4 rounded-tl-2xl">
            <h1 className="text-4xl font-bold mb-8">{heading}</h1>
            <FocusCards
              cards={cards}
              onEdit={(resource) => {
                setEditingResource(resource)
                setIsEditDialogOpen(true)
              }}
              onDelete={handleDeleteResource}
              showActions={activeTab === "my"}
            />
            {activeTab === "my" && (
              <Button
                className="fixed bottom-8 right-8 rounded-full w-16 h-16"
                size="icon"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <IconPlus className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <AddResourceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddResource}
      />
      <EditResourceDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onEdit={handleEditResource}
        resource={editingResource}
      />
    </div>
    </>
  )
}

const SidebarButton = ({ icon, text, isActive, onClick, open }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-lg transition-colors",
      isActive ? "text-[#7b8dea] hover:bg-gray-700" : "text-gray-300 hover:bg-gray-700"
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
