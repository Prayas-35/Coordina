"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { proposalSchema } from "@/app/_models/schema";
import { verifyToken } from "@/app/_middleware/verify";
import connectToDatabase from "@/app/_middleware/mongodb";

async function postHandler(req: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Create the Proposal model if it doesn't exist
        const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);

        // Parse the incoming request body
        const token = req.headers.get("Authorization");
        const department_uid = await verifyToken(token);

        console.log("Department UID:", department_uid);

        // Updated query to match the new schema structure
        const proposals = await Proposal.find({
            $or: [
                { department_uid: department_uid },
                { 'dept_uids.uid': department_uid }  // Changed to match uid within dept_uids objects
            ]
        })
        .select({
            name: 1,
            department_uid: 1,
            description: 1,
            dept_uids: 1,
            votingStatus: 1,
            votes: 1,
            createdAt: 1,
            updatedAt: 1
        })
        .lean();

        // Transform the votes Map to a regular object for JSON serialization
        const serializedProposals = proposals.map(proposal => {
            // Check if votes is a Map or an object
            const votesObj = proposal.votes instanceof Map 
                ? Object.fromEntries(proposal.votes) 
                : proposal.votes || {};
        
            return {
                ...proposal,
                votes: votesObj
            };
        });

        console.log("Proposals:", serializedProposals);

        // Respond with a success message
        return NextResponse.json({
            success: true,
            message: "Proposals fetched successfully",
            proposals: serializedProposals
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching proposals:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching the proposals",
            error: error.message
        }, { status: 500 });
    }
}

export {
    postHandler as POST
}
