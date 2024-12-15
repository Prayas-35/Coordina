"use server";

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req: NextRequest) {
  try {
    // Parse form data and extract the PDF file
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Convert the PDF file to a Buffer
    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    // Define a temporary path to save the PDF file
    const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}-${pdfFile.name}`);
    await fs.mkdir(path.dirname(tempFilePath), { recursive: true });

    // Save the PDF buffer to the filesystem
    await fs.writeFile(tempFilePath, buffer);

    // Use PDFLoader to load and extract content from the saved file
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    // Extract and combine the page content
    const content = docs.map((doc) => doc.pageContent).join('\n');

    // Clean up: Delete the temporary file after processing
    await fs.unlink(tempFilePath);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}
