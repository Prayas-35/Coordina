"use server";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

async function posthandler(req) {
    await connectToDatabase();

    const body = await req.json();
    const { uid, password } = body;

    if (!uid || !password) {
        return NextResponse.json({ message: 'All fields are required' });
    }

    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

    const existingDepartment = await Department.findOne({ uid });
    if (!existingDepartment) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const isValid = await compare(password, existingDepartment.password);
    if (!isValid) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
    }

    const token = jwt.sign({ userId: existingDepartment._id }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    posthandler as POST
}