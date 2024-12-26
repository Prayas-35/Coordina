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
        const { proposalId, vote } = body;

        // Validate input
        if (!proposalId || vote === undefined) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Find the proposal
        const proposal = await Proposal.findById(proposalId);
        
        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // Check if voting is active
        // if (proposal.votingStatus !== 'active') {
        //     return NextResponse.json({ error: "Voting is not currently active" }, { status: 400 });
        // }

        // Check if the department has already voted
        if (proposal.votes.has(department_uid)) {
            return NextResponse.json({ error: "Department has already voted" }, { status: 400 });
        }

        // Cast the vote
        proposal.votes.set(department_uid, {
            status: vote ? 'approved' : 'rejected',
            timestamp: new Date()
        });

        // Save the proposal (this will trigger the pre-save hook to calculate vote percentage)
        await proposal.save();

        // Return the updated votes
        const votesArray = Array.from(proposal.votes, ([uid, voteData]) => ({
            uid,
            ...voteData
        }));

        return NextResponse.json(votesArray, { status: 200 });

    } catch (error) {
        console.error("Error casting vote:", error);
        return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
    }
}

// async function getHandler(req: NextRequest) {
//     try {
//         // Connect to the database
//         await connectToDatabase();
        
//         // Create the Proposal model if it doesn't exist
//         const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
        
//         // Extract proposal ID from the URL
        

//         if (!proposalId) {
//             return NextResponse.json({ error: "Invalid proposal ID" }, { status: 400 });
//         }

//         // Find the proposal
//         const proposal = await Proposal.findById(proposalId);
        
//         if (!proposal) {
//             return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
//         }

//         // Convert votes Map to array
//         const votesArray = Array.from(proposal.votes, ([uid, voteData]) => ({
//             uid,
//             ...voteData
//         }));

//         return NextResponse.json(votesArray, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching votes:", error);
//         return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
//     }
// }

export {
    postHandler as POST,
    // getHandler as GET
}
