"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { agencySchema } from "@/app/_models/schema";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;

// Define the Agency interface extending mongoose's Document interface
interface AgencyDocument extends Document {
    username: string;
    email: string;
    password: string;
}

interface RequestBody {
    username: string;
    email: string;
    password: string;
}

async function postHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const body: RequestBody = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const Agency: Model<AgencyDocument> = mongoose.models.Agency || mongoose.model<AgencyDocument>("Agency", agencySchema);

    const existingAgency = await Agency.findOne({ $or: [{ username }, { email }] }).exec();
    if (existingAgency) {
        return NextResponse.json({ message: "Username or email already exists" }, { status: 400 });
    }

    const newAgency = new Agency({ username, email, password: hashedPassword });
    await newAgency.save();

    const token = jwt.sign({ id: newAgency._id, username: newAgency.username }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    postHandler as POST
};
