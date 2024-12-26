"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { projectSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

async function postHandler(req: NextRequest) {
    await connectToDatabase();

    const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

    const body = await req.json();
    const { status, id } = body;

    try {
        const project = await Project
            .findOneAndUpdate({ _id: id }, status, { new: true });

            // console.log("Project updated", project);
        return NextResponse.json(project, { status: 200 });
    }
    catch (error) {
        console.error("Error updating project", error);
        return NextResponse.json({ error: "Error updating project" }, { status: 500 });
    }
}

export {
    postHandler as POST
}
