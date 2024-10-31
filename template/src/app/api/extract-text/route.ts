// src/app/api/extract-text/route.ts
import { NextRequest, NextResponse } from "next/server";

// Helper function for CORS headers
function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return corsResponse(
        NextResponse.json(
          { error: "No file provided or invalid file" },
          { status: 400 }
        )
      );
    }

    // Dynamically import pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const data = await pdfParse(buffer) as { text: string };
    
    return corsResponse(
      NextResponse.json({ text: data.text })
    );
  } catch (error) {
    console.error("Error processing PDF:", error);
    return corsResponse(
      NextResponse.json(
        { error: "Failed to process PDF" },
        { status: 500 }
      )
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return corsResponse(
    NextResponse.json({}, { status: 200 })
  );
}

export const dynamic = 'force-dynamic';
