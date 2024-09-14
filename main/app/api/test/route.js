"use server";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/app/_middleware/mongodb";
import { exampleSchema } from "@/app/_models/schema";

async function posthandler(req) {
  await connectToDatabase();
  const body = await req.json();
  const { name, age } = body;
//   console.log(name, age);

  const Example = mongoose.models.example || mongoose.model("Example", exampleSchema);

  const newExample = new Example({ name, age });
  await newExample.save();

  return NextResponse.json({ message: 'done!' });
}

export {
    posthandler as POST
}