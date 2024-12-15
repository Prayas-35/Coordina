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
        
        const { name, description, concernedDepartments } = body;
        
        // Validate the required fields
        if (!name || !department_uid || !description || !Array.isArray(concernedDepartments) || concernedDepartments.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: 'name', 'department', 'description', or 'concernedDepartments'"
            }, { status: 400 });
        }

        // Validate each concerned department has required fields
        const isValidDepartments = concernedDepartments.every(dept => 
            dept.uid && dept.designation && dept.email
        );

        if (!isValidDepartments) {
            return NextResponse.json({
                success: false,
                message: "Each concerned department must include uid, designation, and email"
            }, { status: 400 });
        }

        // Create a new proposal document
        const newProposal = new Proposal({
            name,
            department_uid,
            description,
            dept_uids: concernedDepartments,
            votingStatus: 'not-started',
            // Initialize votes Map with department UIDs
            votes: new Map(concernedDepartments.map(dept => [
                dept.uid, 
                { 
                    status: 'pending',
                    timestamp: null
                }
            ]))
        });

        // Save the proposal to the database
        await newProposal.save();

        // Respond with a success message
        return NextResponse.json({
            success: true,
            message: "Proposal created successfully",
            proposal: newProposal
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating proposal:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while creating the proposal",
            error: error.message
        }, { status: 500 });
    }
}

export {
    postHandler as POST
};
