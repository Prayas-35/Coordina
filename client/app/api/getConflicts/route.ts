"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { projectSchema } from "@/app/_models/schema";

// Define the Project interface
interface Project {
    _id: string;
    dept_uid: string;
    name: string;
    wardNumber: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    supervision: string;
    resources: string;
    status: "not-started" | "in-progress" | "completed";
    createdAt?: string;
    updatedAt?: string;
}

// Define the Conflict interface
interface Conflict {
    id: string;
    title: string;
    description: string;
    status: string;
    relatedProjects: string[];
    relatedDepartments: string[];
    discussions: number[];
}

// Helper function to check conflicts
function hasConflict(project1: Project, project2: Project): boolean {
    // Only check for conflicts in the same ward or nearby wards
    if (project1.wardNumber !== project2.wardNumber) return false;

    const startDate1 = new Date(project1.date);
    const endDate1 = new Date(startDate1.getTime() + project1.duration * 60 * 60 * 1000);

    const startDate2 = new Date(project2.date);
    const endDate2 = new Date(startDate2.getTime() + project2.duration * 60 * 60 * 1000);

    return (
        startDate1 < endDate2 && endDate1 > startDate2 // Checks if the intervals overlap
    );
}

// function hasConflict(project1: Project, project2: Project): boolean {
//     const startDate1 = new Date(project1.date);
//     const endDate1 = new Date(startDate1.getTime() + project1.duration * 60 * 60 * 1000);

//     const startDate2 = new Date(project2.date);
//     const endDate2 = new Date(startDate2.getTime() + project2.duration * 60 * 60 * 1000);

//     return (
//         startDate1 < endDate2 && endDate1 > startDate2 // Checks if the intervals overlap
//     );
// }

async function getHandler(req: NextRequest) {
    await connectToDatabase();

    const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);

    const projects: Project[] = await ProjectModel.find();

    const conflicts: Conflict[] = [];
    const conflictProjects: { project1: Project; project2: Project }[] = [];

    // Check for conflicts among all projects
    for (let i = 0; i < projects.length; i++) {
        for (let j = i + 1; j < projects.length; j++) {
            if (hasConflict(projects[i], projects[j])) {
                const conflictId = `conflict-${projects[i]._id}-${projects[j]._id}`;
                
                conflictProjects.push({
                    project1: projects[i],
                    project2: projects[j],
                });

                conflicts.push({
                    id: conflictId,
                    title: `Conflict: ${projects[i].name} vs ${projects[j].name}`,
                    description: `Scheduling conflict between ${projects[i].name} and ${projects[j].name} in Ward ${projects[i].wardNumber}`,
                    status: "Active",
                    relatedProjects: [projects[i]._id, projects[j]._id],
                    relatedDepartments: [projects[i].dept_uid, projects[j].dept_uid],
                    discussions: [] // You can add discussion logic later
                });
            }
        }
    }

    return NextResponse.json(
        {
            projects: projects.map(p => ({
                id: p._id,
                name: p.name,
                wardNumber: p.wardNumber,
                date: p.date,
                status: p.status
            })),
            conflicts,
        },
        { status: 200 }
    );
}

export { getHandler as GET };
