"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { workShopSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";

async function getHandler(req: NextRequest) {
    await connectToDatabase();

    const Workshop = mongoose.models.Workshop || mongoose.model("Workshop", workShopSchema);

    try {
        const workshops = await Workshop.find();
        return NextResponse.json(workshops, { status: 200 });
    } catch (error) {
        console.error("Error fetching workshops", error);
        return NextResponse.json({ error: "Error fetching workshops" }, { status: 500 });
    }
}

export {
    getHandler as GET
}