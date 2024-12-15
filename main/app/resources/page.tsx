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
import Navbar from '@/components/functions/NavBar'

interface Resource {
    id: number
    name: string
    description: string
    priority: string
    category: string
    src: string
}

const allResourcesData: Resource[] = [
    { id: 1, name: "Cement", description: "Needed for construction purposes", priority: "High", category: "Transport", src: "https://www.jkcement.com/wp-content/uploads/2023/07/cement-powder-with-trowel-put-brick-construction-work-768x512-jpg.webp" },
    { id: 2, name: "Solar Panels", description: "Needed for sustainable energy project", priority: "Medium", category: "Electricity", src: "https://www.sunrun.com/sites/default/files/styles/gsc_feature_750x300/public/how-long-do-solar-panels-really-last-opt.jpg?itok=8MGFcQp7" },
    { id: 3, name: "Stainless Steel Pipes", description: "Needed for pipeline installation", priority: "Low", category: "Water Supply", src: "https://www.servicesteel.org/wp-content/uploads/2022/01/shutterstock_1289431369.jpg" },
    { id: 4, name: "Cranes", description: "Needed at construction sites", priority: "High", category: "Transport, Water Supply", src: "https://heavyequipmenttraining.com/wp-content/uploads/2018/12/7-Types-of-Construction-Cranes.jpg" },
    { id: 5, name: "Bulbs", description: "Needed for streetlamps installation project", priority: "Medium", category: "Electricity", src: "https://d2qu5xmcgmzxnb.cloudfront.net/ewogICAgICAgICAgICAgICAgICAgICAgICAiYnVja2V0IjogImZpbGVzLmxici5jbG91ZCIsCiAgICAgICAgICAgICAgICAgICAgICAgICJrZXkiOiAicHVibGljLzIwMjEtMTEvc2h1dHRlcnN0b2NrXzg1MDg2ODQ0LmpwZyIsCiAgICAgICAgICAgICAgICAgICAgICAgICJlZGl0cyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAicmVzaXplIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgIndpZHRoIjogOTQ1LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgImhlaWdodCI6IDUyNiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJmaXQiOiAiY292ZXIiCiAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQ==" },
    { id: 6, name: "Street Signs", description: "Needed for street signage project", priority: "Medium", category: "Transport", src: "https://www.safetysign.com/blog/wp-content/uploads/2017/02/missing-stop-sign.jpg" },
]

const myResourcesData: Resource[] = [
    { id: 1, name: "Solar Panels", description: "Needed for sustainable energy project", priority: "Medium", category: "Electricity", src: "https://www.sunrun.com/sites/default/files/styles/gsc_feature_750x300/public/how-long-do-solar-panels-really-last-opt.jpg?itok=8MGFcQp7" },
    { id: 2, name: "Bulbs", description: "Needed for streetlamps installation project", priority: "Medium", category: "Electricity", src: "https://d2qu5xmcgmzxnb.cloudfront.net/ewogICAgICAgICAgICAgICAgICAgICAgICAiYnVja2V0IjogImZpbGVzLmxici5jbG91ZCIsCiAgICAgICAgICAgICAgICAgICAgICAgICJrZXkiOiAicHVibGljLzIwMjEtMTEvc2h1dHRlcnN0b2NrXzg1MDg2ODQ0LmpwZyIsCiAgICAgICAgICAgICAgICAgICAgICAgICJlZGl0cyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAicmVzaXplIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgIndpZHRoIjogOTQ1LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgImhlaWdodCI6IDUyNiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJmaXQiOiAiY292ZXIiCiAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQ==" },
]

interface FocusCardProps {
    cards: {
        id: number
        title: string
        src: string
        description: string
        priority: string
        category: string
        name: string
    }[]
    onEdit: (resource: Resource) => void
    onDelete: (id: number) => void
    showActions: boolean
}

const FocusCards: React.FC<FocusCardProps> = ({ cards, onEdit, onDelete, showActions }) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={cn(
                        "relative h-60 bg-gray-800 rounded-xl overflow-hidden cursor-pointer",
                        focusedIndex === i ? "md:col-span-3" : ""
                    )}
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
                                        onEdit(cards[i])
                                    }}
                                >
                                    <IconEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(cards[i].id)
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

interface AddResourceDialogProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (resource: Resource) => void
}

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ isOpen, onClose, onAdd }) => {
    const [newResource, setNewResource] = useState<Resource>({
        id: 0,
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
            id: 0,
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

interface EditResourceDialogProps {
    isOpen: boolean
    onClose: () => void
    onEdit: (resource: Resource) => void
    resource: Resource | null
}

const EditResourceDialog: React.FC<EditResourceDialogProps> = ({ isOpen, onClose, onEdit, resource }) => {
    const [editedResource, setEditedResource] = useState<Resource | null>(resource || {
        id: 0,
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
        if (editedResource && editedResource.id) {
            onEdit(editedResource)
            onClose()
        }
    }

    if (!editedResource) {
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
                                <SelectContent>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Electricity">Electricity</SelectItem>
                                    <SelectItem value="Water Supply">Water Supply</SelectItem>
                                </SelectContent>
                            </SelectTrigger>
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
    const [activeTab, setActiveTab] = useState<"all" | "my">("all")
    const [allResources, setAllResources] = useState<Resource[]>(allResourcesData)
    const [myResources, setMyResources] = useState<Resource[]>(myResourcesData)
    const [displayedResources, setDisplayedResources] = useState<Resource[]>(allResourcesData)
    const [heading, setHeading] = useState("All Requested Resources")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingResource, setEditingResource] = useState<Resource | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (activeTab === "all") {
            setHeading("All Requested Resources")
            setDisplayedResources(allResources)
        } else if (activeTab === "my") {
            setHeading("My Requested Resources")
            setDisplayedResources(myResources)
        }
    }, [activeTab, allResources, myResources])

    const handleAddResource = (newResource: Resource) => {
        const id = Math.max(...allResources.map(r => r.id), 0) + 1
        const newResourceWithId = { ...newResource, id }
        setMyResources(prevMyResources => [...prevMyResources, newResourceWithId])
        setAllResources(prevAllResources => [...prevAllResources, newResourceWithId])
    }

    const handleEditResource = (editedResource: Resource) => {
        if (editedResource && editedResource.id) {
            setMyResources(prevMyResources =>
                prevMyResources.map(r => r.id === editedResource.id ? editedResource : r)
            )
            setAllResources(prevAllResources =>
                prevAllResources.map(r => r.id === editedResource.id ? editedResource : r)
            )
        }
    }

    const handleDeleteResource = (id: number) => {
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
        name: resource?.name
    }))

    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
            <div className="min-h-screen">
                <div className="dark:bg-neutral-900 bg-neutral-100">
                    <div className="flex min-h-screen" style={{ width: 'calc(100vw - 15px)' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: open ? "250px" : "60px" }}
                            className="dark:bg-neutral-900 bg-neutral-100 rounded-tl-md overflow-hidden"
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
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
                        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-300 dark:border-neutral-800 bg-background flex flex-col gap-2 flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8  bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-pink-600 to-pink-500">
                                {heading}
                            </h1>
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

interface SidebarButtonProps {
    icon: React.ReactNode
    text: string
    isActive: boolean
    onClick: () => void
    open: boolean
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, text, isActive, onClick, open }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
            "flex items-center gap-4 px-4 py-2 rounded-lg transition-colors",
            isActive ? "text-[#7b8dea] dark:hover:bg-gray-700 hover:bg-gray-200" : "dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200"
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