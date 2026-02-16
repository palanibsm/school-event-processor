import OpenAI from "openai";
import { buildPrompt } from "./prompts";
import type { SchoolEvent, EnabledFields } from "./types";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function extractEventsFromImages(
  base64Images: string[],
  customPrompt?: string,
  enabledFields?: EnabledFields
): Promise<SchoolEvent[]> {
  const prompt = buildPrompt(customPrompt, enabledFields);

  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: prompt },
    ...base64Images.map(
      (img) =>
        ({
          type: "image_url" as const,
          image_url: {
            url: img,
            detail: "high" as const,
          },
        })
    ),
  ];

  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert at extracting structured event data from Singapore school communications. You are thorough and never miss events. You always output valid JSON.",
      },
      {
        role: "user",
        content,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "school_events_extraction",
        strict: true,
        schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  date: { type: "string" },
                  start_time: { type: ["string", "null"] },
                  end_time: { type: ["string", "null"] },
                  location: { type: ["string", "null"] },
                  event_type: {
                    type: "string",
                    enum: [
                      "exam",
                      "field_trip",
                      "celebration",
                      "meeting",
                      "workshop",
                      "holiday",
                      "deadline",
                      "other",
                    ],
                  },
                  attire: { type: ["string", "null"] },
                  things_to_bring: {
                    type: ["array", "null"],
                    items: { type: "string" },
                  },
                  notes: { type: ["string", "null"] },
                  is_all_day: { type: "boolean" },
                },
                required: [
                  "title",
                  "date",
                  "start_time",
                  "end_time",
                  "location",
                  "event_type",
                  "attire",
                  "things_to_bring",
                  "notes",
                  "is_all_day",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["events"],
          additionalProperties: false,
        },
      },
    },
    max_tokens: 4096,
    temperature: 0.1,
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(message) as { events: SchoolEvent[] };
  return parsed.events;
}
