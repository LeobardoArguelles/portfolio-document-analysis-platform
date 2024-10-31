// src/app/api/extract-text/route.ts
import { NextRequest, NextResponse } from "next/server";

const pdf = require("pdf-parse");

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "API is working" });
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers }
      );
    }

    const bytes = await file.arrayBuffer();
    const dataBuffer = Buffer.from(bytes);

    const data = await pdf(dataBuffer);
    const text = data.text;

    return NextResponse.json({ text }, { headers });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Ensure dynamic routing
export const dynamic = "force-dynamic";
