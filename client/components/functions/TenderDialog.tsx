// components/functions/TenderDialog.tsx

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/_contexts/authcontext";

interface Tender {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    estimatedCost: string;
    location: string;
}

interface TenderDialogProps {
    token: string;
}

const TenderDialog: React.FC<TenderDialogProps> = ({ token }) => {
    const [isTenderDialogOpen, setIsTenderDialogOpen] = useState(false);
    const [tenderData, setTenderData] = useState<Tender>({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        estimatedCost: "",
        location: "",
    });

    const handleTenderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTenderData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitTender = async () => {
        try {
            console.log("Submitting tender:", tenderData);
            const response = await fetch("/api/addTender", {
                method: "POST",
                headers: {
                    Authorization: token as string,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tenderData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add tender");
            }

            // Reset form and close dialog
            setTenderData({
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                estimatedCost: "",
                location: "",
            });
            setIsTenderDialogOpen(false);
            return result;
        } catch (error) {
            console.error("Error adding tender:", error);
            throw error;
        }
    };

    return (
        <Dialog open={isTenderDialogOpen} onOpenChange={setIsTenderDialogOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-center items-center h-full">
                <Button className="h-28 w-28" variant="outline">Add Tender</Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Tender</DialogTitle>
                    <DialogDescription>
                        Submit a new tender with details.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderName" className="text-right">
                            Tender Name
                        </Label>
                        <Input
                            id="tenderName"
                            name="name"
                            value={tenderData.name}
                            onChange={handleTenderInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderDescription" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="tenderDescription"
                            name="description"
                            value={tenderData.description}
                            onChange={handleTenderInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderStartDate" className="text-right">
                            Start Date
                        </Label>
                        <Input
                            id="tenderStartDate"
                            name="startDate"
                            type="date"
                            value={tenderData.startDate}
                            onChange={handleTenderInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderEndDate" className="text-right">
                            End Date
                        </Label>
                        <Input
                            id="tenderEndDate"
                            name="endDate"
                            type="date"
                            value={tenderData.endDate}
                            onChange={handleTenderInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderEstimatedCost" className="text-right">
                            Estimated Cost
                        </Label>
                        <Input
                            id="tenderEstimatedCost"
                            name="estimatedCost"
                            type="number"
                            value={tenderData.estimatedCost}
                            onChange={handleTenderInputChange}
                            className="col -span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tenderLocation" className="text-right">
                            Location
                        </Label>
                        <Input
                            id="tenderLocation"
                            name="location"
                            value={tenderData.location}
                            onChange={handleTenderInputChange}
                            className="col-span-3"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={submitTender}
                        disabled={!tenderData.name || !tenderData.description}
                    >
                        Submit Tender
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TenderDialog;