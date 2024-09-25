"use server";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { projectSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";
import { verifyToken } from "@/app/_middleware/verify";

// Helper function to get the quarter from a date
function getQuarter(date) {
    const month = date.getMonth(); // 0-based index (0 = January, 11 = December)
    const year = date.getFullYear();
    let quarter;

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

async function postHandler(req) {
    await connectToDatabase();

    const token = req.headers.get("Authorization");
    const uId = await verifyToken(token);
    // console.log(uId);

    const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

    try {
        const projects = await Project.find({ dept_uid: uId }).select('name status date');

        // Map through projects and create the desired format
        const formattedProjects = projects.map(project => {
            const timeline = getQuarter(new Date(project.date));  // Convert date to timeline
            return {
                id: project._id,   // Assuming '_id' is the unique identifier
                name: project.name,
                status: project.status,
                timeline: timeline
            };
        });

        // console.log(formattedProjects);
        return NextResponse.json(formattedProjects, { status: 200 });
    } catch (error) {
        console.error("Error getting projects", error);
        return NextResponse.json({ error: "Error getting projects" }, { status: 500 });
    }
}

export {
    postHandler as POST
};
