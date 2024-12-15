"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { tenderSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();
        
        // Create the Tender model if it doesn't exist
        const Tender = mongoose.models.Tender || mongoose.model("Tender", tenderSchema);
        
        // Parse the incoming request body
        const token = req.headers.get("Authorization");
        const department_uid = await verifyToken(token);
        const body = await req.json();
        
        const { name, description, startDate, endDate, estimatedCost, location } = body;
        
        // Validate the required fields
        if (!name || !department_uid || !description || !startDate || !endDate || !estimatedCost || !location) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: 'name', 'description', 'startDate', 'endDate', 'estimatedCost', or 'location'"
            }, { status: 400 });
        }

        // Create a new tender document
        const newTender = new Tender({
            name,
            department_uid,
            description,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            estimated_cost: Number(estimatedCost),
            location,
            interested_agencies: []
        });

        // Save the tender to the database
        await newTender.save();

        return NextResponse.json({
            success: true,
            message: "Tender added successfully"
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to add tender"
        }, { status: 500 });
    }
}

export {
    postHandler as POST
}