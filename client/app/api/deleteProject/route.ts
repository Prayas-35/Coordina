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
    const { id } = body;
    // console.log(id);

    try {
        // const uId = await verifyToken(token);
        // const pro = await Project.findOne({ _id: id });
        // console.log(pro);
        const project = await Project.findOneAndDelete({ _id: id });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 500 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error("Error deleting project", error);
        return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
    }
}

export {
    postHandler as POST
}