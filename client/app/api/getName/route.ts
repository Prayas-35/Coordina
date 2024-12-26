"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { verifyToken } from "@/app/_middleware/verify";

// Define the Department interface extending mongoose's Document interface
interface DepartmentDocument extends Document {
    username: string;
    uid: string;
    department: string;
}

async function getHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const Department: Model<DepartmentDocument> = mongoose.models.Department || mongoose.model<DepartmentDocument>("Department", departmentSchema);

    const token = req.headers.get("Authorization");

    try {
        const uId = await verifyToken(token);
        if (!uId || (typeof uId === 'object' && 'message' in uId)) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const dept = await Department.findOne({ uid: uId }).exec();

        if (!dept) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 });
        }

        const { username: name, uid, department } = dept;
        return NextResponse.json({ name, uid, department }, { status: 200 });
    } catch (error) {
        console.error("Error getting department", error);
        return NextResponse.json({ error: "Error getting department" }, { status: 500 });
    }
}

export {
    getHandler as GET
};
