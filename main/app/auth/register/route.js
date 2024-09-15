"use server";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { hash } from "bcrypt";
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

async function posthandler(req) {
    await connectToDatabase();
    const body = await req.json();
    const { username, department, password } = body;

    if (!username || !department || !password) {
        return NextResponse.json({ message: 'All fields are required' });
    }

    const hashedPassword = await hash(password, 10);

    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

    const existingDepartment = await Department.findOne({ username });
    if (existingDepartment) {
        return NextResponse.json({ message: 'username already exists' }, { status: 400 });
    }

    const newDepartment = new Department({ username, department, password: hashedPassword });
    await newDepartment.save();

    const token = jwt.sign({ uId: username.uid }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    posthandler as POST
}