"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { proposalSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();
        
        // Create the Proposal model if it doesn't exist
        const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
        
        // Parse the incoming request body
        const token = req.headers.get("Authorization");
        const department_uid = await verifyToken(token);
        const body = await req.json();
        const { proposalId } = body;

        // Validate input
        if (!proposalId) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Find the proposal
        const proposal = await Proposal.findById(proposalId);
        
        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        const votesArray = Array.from(proposal.votes, ([uid, voteData]) => ({
            uid,
            ...voteData
        }));

        return NextResponse.json(votesArray, { status: 200 });
        // return NextResponse.json(votesArray, { status: 200 });

    } catch (error) {
        console.error("Failed to cast vote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export {
    postHandler as POST
}