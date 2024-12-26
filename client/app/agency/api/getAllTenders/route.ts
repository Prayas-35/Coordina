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
        
        try {
            const tenders = await Tender.find();
            return NextResponse.json(tenders, { status: 200 });
        }
        catch (error) {
            console.error("Error fetching tenders", error);
            return NextResponse.json({ error: "Error fetching tenders" }, { status: 500 });
        }

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