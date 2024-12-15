'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Navbar from '@/components/functions/NavBar'

interface Tender {
    _id: string;
    name: string;
    department_uid: string;
    description: string;
    start_date: Date;
    end_date: Date;
    estimated_cost: number;
    location: string;
    interested_agencies: {
        name: string;
        negotiated_amount: number;
    }[];
}

const mockTenders: Tender[] = [
    {
        _id: '1',
        name: 'Road Construction Project',
        department_uid: 'dept123',
        description: 'Construction of a 10km road in the city center',
        start_date: new Date('2023-06-01'),
        end_date: new Date('2023-12-31'),
        estimated_cost: 1000000,
        location: 'City Center',
        interested_agencies: [
            { name: 'Agency A', negotiated_amount: 950000 },
            { name: 'Agency B', negotiated_amount: 980000 },
            { name: 'Agency C', negotiated_amount: 1020000 },
        ],
    },
    {
        _id: '2',
        name: 'Public Park Renovation',
        department_uid: 'dept123',
        description: 'Renovation of Central Park including new playground equipment',
        start_date: new Date('2023-07-15'),
        end_date: new Date('2023-10-15'),
        estimated_cost: 500000,
        location: 'Central Park',
        interested_agencies: [
            { name: 'Agency X', negotiated_amount: 480000 },
            { name: 'Agency Y', negotiated_amount: 510000 },
        ],
    },
    {
        _id: '3',
        name: 'City Hall Expansion',
        department_uid: 'dept123',
        description: 'Expansion of City Hall to include new office spaces',
        start_date: new Date('2023-08-01'),
        end_date: new Date('2024-02-29'),
        estimated_cost: 2000000,
        location: 'Downtown',
        interested_agencies: [
            { name: 'Agency M', negotiated_amount: 1950000 },
            { name: 'Agency N', negotiated_amount: 2100000 },
            { name: 'Agency O', negotiated_amount: 2050000 },
        ],
    },
];

function TenderItem({ tender }: { tender: Tender }) {
    const [selectedAgency, setSelectedAgency] = useState<string | null>(null)

    const handleApprove = (agencyName: string) => {
        // In a real application, you would send this to your backend
        console.log(`Approved agency: ${agencyName} for tender: ${tender.name}`)
        setSelectedAgency(agencyName)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{tender.name}</CardTitle>
                <CardDescription>{tender.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p><strong>Location:</strong> {tender.location}</p>
                <p><strong>Estimated Cost:</strong> ${tender.estimated_cost.toLocaleString()}</p>
                <p><strong>Start Date:</strong> {tender.start_date.toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {tender.end_date.toLocaleDateString()}</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="mt-4">View Interested Agencies</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Interested Agencies for {tender.name}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {tender.interested_agencies.map((agency) => (
                                <div key={agency.name} className="mb-4 p-4 border rounded">
                                    <p><strong>Agency:</strong> {agency.name}</p>
                                    <p><strong>Negotiated Amount:</strong> ${agency.negotiated_amount.toLocaleString()}</p>
                                    <Button
                                        onClick={() => handleApprove(agency.name)}
                                        disabled={selectedAgency !== null}
                                        className="mt-2"
                                    >
                                        {selectedAgency === agency.name ? 'Approved' : 'Approve'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

function TenderList({ tenders }: { tenders: Tender[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tenders.map((tender) => (
                <TenderItem key={tender._id} tender={tender} />
            ))}
        </div>
    )
}

export default function TendersPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState);
    };
    return (
        <>
            <Navbar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Department Tenders</h1>
                <TenderList tenders={mockTenders} />
            </div>
        </>
    )
}

