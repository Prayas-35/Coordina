"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { departmentSchema, projectSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

async function postHandler(req: NextRequest) {
    await connectToDatabase();

    const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

    try {
        const projects = await Project.find();

        const updatedProjects = await Promise.all(
            projects.map(async (project) => {
                const department = await Department.findOne({ uid: project.dept_uid });
                return {
                    ...project._doc, // Spread the project details
                    department: department ? department.department : "Unknown Department", // Add department name if found
                };
            })
        );
        // console.log("Projects", updatedProjects);
        return NextResponse.json(updatedProjects, { status: 200 });
    } catch (error) {
        console.error("Error getting projects", error);
        return NextResponse.json({ error: "Error getting projects" }, { status: 500 });
    }
}

export {
    postHandler as POST
};