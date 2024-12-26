"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;

// Define the Department interface extending mongoose's Document interface
interface DepartmentDocument extends Document {
    username: string;
    department: string;
    password: string;
    uid: string;
}

interface RequestBody {
    username: string;
    department: string;
    password: string;
}

async function postHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const body: RequestBody = await req.json();
    const { username, department, password } = body;

    if (!username || !department || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const Department: Model<DepartmentDocument> = mongoose.models.Department || mongoose.model<DepartmentDocument>("Department", departmentSchema);

    const existingDepartment = await Department.findOne({ username }).exec();
    if (existingDepartment) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    const newDepartment = new Department({ username, department, password: hashedPassword });
    await newDepartment.save();

    const token = jwt.sign({ uId: newDepartment.uid }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    postHandler as POST
};
