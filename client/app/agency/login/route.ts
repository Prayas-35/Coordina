"use server";

import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { agencySchema } from "@/app/_models/schema";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;

// Define the Agency interface extending mongoose's Document interface
interface AgencyDocument extends Document {
    username: string;
    email: string;
    password: string;
}

interface RequestBody {
    username?: string;
    email?: string;
    password: string;
}

async function postHandler(req: Request): Promise<Response> {
    await connectToDatabase();

    const body: RequestBody = await req.json();
    const { username, password } = body;

    if ((!username) || !password) {
        return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const Agency: Model<AgencyDocument> = mongoose.models.Agency || mongoose.model<AgencyDocument>("Agency", agencySchema);

    const existingAgency = await Agency.findOne({ username }).exec();

    if (!existingAgency) {
        return NextResponse.json({ message: "Invalid username" }, { status: 400 });
    }

    const isValid = await compare(password, existingAgency.password);
    if (!isValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 400 });
    }

    const token = jwt.sign({ id: existingAgency._id, username: existingAgency.username }, secretKey, { expiresIn: "30d" });

    return NextResponse.json({ token }, { status: 200 });
}

export {
    postHandler as POST
};
