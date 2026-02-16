import { NextRequest, NextResponse } from "next/server";
import { extractEventsFromImages } from "@/lib/openai";
import { generateIcsContent } from "@/lib/calendar";
import type { ExtractionRequest, ExtractionResponse } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: ExtractionRequest = await request.json();

    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }
    if (body.images.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 pages supported" },
        { status: 400 }
      );
    }

    const events = await extractEventsFromImages(
      body.images,
      body.customPrompt,
      body.enabledFields
    );

    let icsContent = "";
    if (events.length > 0) {
      icsContent = generateIcsContent(events);
    }

    const response: ExtractionResponse = {
      events,
      icsContent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Extraction error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to extract events. Please try again." },
      { status: 500 }
    );
  }
}
