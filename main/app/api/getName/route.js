"use server";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { departmentSchema } from "@/app/_models/schema";
import { verifyToken } from "@/app/_middleware/verify";

async function getthandler(req) {
    await connectToDatabase();

    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);
    
    const token = req.headers.get("Authorization");
    // console.log(token);

    try {
        const uId = await verifyToken(token);
        // console.log(uId);
        const dept = await Department.findOne({ uid: uId });
        const name = dept.username;
        const uid = dept.uid;
        return NextResponse.json({ name, uid }, { status: 200 });
    } catch (error) {
        console.error("Error getting users", error);
        return NextResponse.json({ error: "Error getting users" }, { status: 500 });
    }
}

export {
    getthandler as GET
}