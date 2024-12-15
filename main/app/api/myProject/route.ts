"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import { projectSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";
import { verifyToken } from "@/app/_middleware/verify";

// Define the Project interface extending mongoose's Document interface
interface ProjectDocument extends Document {
    name: string;
    status: string;
    date: Date;
    dept_uid: string;
}

// Helper function to get the quarter from a date
function getQuarter(date: Date): string {
    const month = date.getMonth(); // 0-based index (0 = January, 11 = December)
    const year = date.getFullYear();
    let quarter: string;

    if (month < 3) {
        quarter = "Q1";
    } else if (month < 6) {
        quarter = "Q2";
    } else if (month < 9) {
        quarter = "Q3";
    } else {
        quarter = "Q4";
    }

    return `${quarter} ${year}`;
}

// Handler function for the POST request
async function postHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const token = req.headers.get("Authorization");
    const uId = await verifyToken(token);

    if (!uId || typeof uId === 'object' && 'message' in uId) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const Project: Model<ProjectDocument> = mongoose.models.Project || mongoose.model<ProjectDocument>("Project", projectSchema);

    try {
        const projects = await Project.find({ dept_uid: uId }).select("name status date").exec();

        // Map through projects and create the desired format
        const formattedProjects = projects.map((project) => {
            const timeline = getQuarter(new Date(project.date)); // Convert date to timeline
            return {
                id: project._id, // Assuming '_id' is the unique identifier
                name: project.name,
                status: project.status,
                timeline: timeline,
            };
        });

        return NextResponse.json(formattedProjects, { status: 200 });
    } catch (error) {
        console.error("Error getting projects", error);
        return NextResponse.json({ error: "Error getting projects" }, { status: 500 });
    }
}

export {
    postHandler as POST
};
