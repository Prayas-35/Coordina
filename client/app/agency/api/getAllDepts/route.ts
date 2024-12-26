"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { departmentSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

async function postHandler(req: NextRequest) {
    await connectToDatabase();

    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

    try {
        const departments = await Department.find();
        return NextResponse.json(departments, { status: 200 });
    } catch (error) {
        console.error("Error getting departments", error);
        return NextResponse.json({ error: "Error getting departments" }, { status: 500 });
    }
}

export {
    postHandler as POST
};