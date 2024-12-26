"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from '@/components/functions/agency/NavBar'

// Define interfaces for type safety
interface Department {
    _id: string
    uid: string
    username: string
    department: string
}

interface Tender {
    _id: string
    name: string
    description: string
    department_uid: string
    location: string
    start_date: string
    end_date: string
    estimated_cost: number
}

export default function AgencyDashboard() {
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [departments, setDepartments] = useState<Department[]>([])
    const [tenders, setTenders] = useState<Tender[]>([])
    const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false)
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
    const [proposedAmount, setProposedAmount] = useState<number>(0)
    const [reason, setReason] = useState<string>('')

    useEffect(() => {
        // Fetch tenders from API
        fetch('api/getAllTenders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data: Tender[]) => {
                console.log('Tenders:', data)
                setTenders(data)
            })
            .catch((error) => {
                console.error('Error fetching tenders:', error)
            })

        // Fetch departments from API
        fetch('api/getAllDepts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data: Department[]) => {
                console.log('Departments:', data)
                // Get unique department names
                const uniqueDepartments = Array.from(
                    new Set(data.map(dept => dept.department))
                ).map(departmentName => {
                    const firstMatchingDept = data.find(d => d.department === departmentName)
                    return {
                        department: departmentName,
                        _id: firstMatchingDept?._id || '',
                        uid: firstMatchingDept?.uid || '',
                        username: firstMatchingDept?.username || ''
                    }
                })
                setDepartments(uniqueDepartments)
            })
            .catch((error) => {
                console.error('Error fetching departments:', error)
            })
    }, [])

    const filteredTenders = selectedDepartment === 'all'
        ? tenders
        : tenders.filter(tender => tender.department_uid === selectedDepartment)

    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState)
    }

    const handleNegotiationRequest = (tender: Tender) => {
        setSelectedTender(tender)
        setProposedAmount(tender.estimated_cost)
        setIsNegotiationModalOpen(true)
    }

    const handleNegotiationSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedTender) {
            // Here you would typically send this data to your API
            console.log('Negotiation submitted:', {
                tenderId: selectedTender._id,
                proposedAmount
            })
            // You can add an API call here to submit the negotiation request
        }
        setIsNegotiationModalOpen(false)
        setSelectedTender(null)
        setProposedAmount(0)
        setReason('')
    }

    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>

                <div className="mb-6">
                    <Select 
                        onValueChange={setSelectedDepartment} 
                        defaultValue={selectedDepartment}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept._id} value={dept.uid}>
                                    {dept.department}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenders.map((tender) => (
                        <Card key={tender._id}>
                            <CardHeader>
                                <CardTitle>{tender.name}</CardTitle>
                                <CardDescription>{tender.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Location:</span> {tender.location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Start Date:</span> {new Date(tender.start_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">End Date:</span> {new Date(tender.end_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Estimated Cost:</span> ₹{tender.estimated_cost.toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleNegotiationRequest(tender)}>
                                    Negotiate Payment
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={isNegotiationModalOpen} onOpenChange={setIsNegotiationModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Negotiate Payment for {selectedTender?.name}</DialogTitle>
                        <DialogDescription>
                            Enter your proposed amount and reason for negotiation.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNegotiationSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="proposedAmount" className="text-right">
                                    Proposed Amount
                                </Label>
                                <Input
                                    id="proposedAmount"
                                    type="number"
                                    value={proposedAmount}
                                    onChange={(e) => setProposedAmount(Number(e.target.value))}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">
                                    Duration
                                </Label>
                                <Textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

