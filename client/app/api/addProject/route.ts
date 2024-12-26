"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { projectSchema } from "@/app/_models/schema";
import { verifyToken } from "@/app/_middleware/verify";
import connectToDatabase from "@/app/_middleware/mongodb";

async function postHandler(req: NextRequest) {
    await connectToDatabase();

    const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

    const token = req.headers.get("Authorization");
    const body = await req.json();
    const { name, wardNumber, date, time, duration, location, supervision, resources } = body;

    try {
        const uId = await verifyToken(token);
        const project = new Project({
            dept_uid: uId,
            name,
            wardNumber,
            date,
            time,
            duration,
            location,
            supervision,
            resources
        });

        const newProject = await project.save();
        return NextResponse.json(newProject, { status: 200 });
    } catch (error) {
        console.error("Error adding project", error);
        return NextResponse.json({ error: "Error adding project" }, { status: 500 });
    }
}

export {
    postHandler as POST
}