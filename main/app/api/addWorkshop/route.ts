"use server";

import { NextRequest, NextResponse } from "next/server";
import { workShopSchema } from "@/app/_models/schema";
import connectToDatabase from "@/app/_middleware/mongodb";
import mongoose from "mongoose";

async function postHandler(req: NextRequest) {
    await connectToDatabase();

    const Workshop = mongoose.models.Workshop || mongoose.model("Workshop", workShopSchema);

    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json();
    const { name, date, time, duration, link, projects, status, department } = body;

    try {
        const workshop = new Workshop({
            name,
            date,
            time,
            duration,
            status: status || "Upcoming", // Default to "upcoming" if not provided
            link,
            projects,
            department
        });

        const newWorkshop = await workshop.save();
        return NextResponse.json(newWorkshop, { status: 201 });
    } catch (error) {
        console.error("Error adding workshop", error);
        return NextResponse.json({ error: "Error adding workshop" }, { status: 500 });
    }
}

export { postHandler as POST };
