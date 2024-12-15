"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;

// Define the Department interface extending mongoose's Document interface
interface DepartmentDocument extends Document {
    uid: string;
    password: string;
}

interface RequestBody {
    uid: string;
    password: string;
}

async function postHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const body: RequestBody = await req.json();
    const { uid, password } = body;

    if (!uid || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const Department: Model<DepartmentDocument> = mongoose.models.Department || mongoose.model<DepartmentDocument>("Department", departmentSchema);

    const existingDepartment = await Department.findOne({ uid }).exec();
    if (!existingDepartment) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const isValid = await compare(password, existingDepartment.password);
    if (!isValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 400 });
    }

    const token = jwt.sign({ uId: existingDepartment.uid }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    postHandler as POST
};
