import type { EnabledFields } from "./types";

export const DEFAULT_PROMPT = `You are analyzing a school communication PDF from a primary school in Singapore. Extract ALL calendar-worthy events, deadlines, and important dates.

For each event found, extract:
- title: Clear, concise event name (e.g., "P4 Learning Journey to Kreta Ayer Heritage Gallery")
- date: The date in YYYY-MM-DD format
- start_time: Start time in HH:MM (24-hour) format. If not specified, set to null
- end_time: End time in HH:MM (24-hour) format. If not specified, set to null
- location: Where the event takes place. Include venue names, online platforms (MS Teams, Zoom), or addresses
- event_type: One of: "exam", "field_trip", "celebration", "meeting", "workshop", "holiday", "deadline", "other"
- attire: Required dress code (e.g., "School uniform", "PE attire", "School T-shirt or Red T-shirt with PE Shorts/Skorts")
- things_to_bring: Array of items to bring (e.g., ["water bottle", "raincoat", "pencil", "snacks"])
- notes: Any other important information parents need to know. Include early dismissal times, special instructions, consent requirements, video submission deadlines, recess timing changes, etc.
- is_all_day: true if the event has no specific time (like a school holiday), false otherwise

IMPORTANT RULES:
1. If a document contains MULTIPLE events (like an exam schedule with several dates), create a SEPARATE event for each date.
2. For exam schedules, include the subject, assessment format, and topics in the title and notes.
3. If dates are class-specific (e.g., "4 Responsibility: 20 Jan, 4 Steadfastness: 22 Jan"), create separate events for each class group.
4. School holidays should be marked as all-day events with event_type "holiday".
5. If a deadline is mentioned (e.g., "Submit video by 11 Feb"), create a separate deadline event.
6. Use Singapore timezone context (Asia/Singapore, UTC+8).
7. Parse dates carefully - Singapore schools typically use DD Month YYYY format (e.g., "20 January 2026").
8. If the year is not explicitly stated, infer from context or assume the current year.
9. For events with changed dismissal times, include the dismissal time prominently in notes.
10. For virtual meetings, include the platform, meeting link, meeting ID, and passcode in notes.`;

export function buildPrompt(
  customPrompt: string | undefined,
  enabledFields: EnabledFields | undefined
): string {
  const prompt = customPrompt || DEFAULT_PROMPT;

  if (enabledFields) {
    const disabledFields = Object.entries(enabledFields)
      .filter(([, enabled]) => !enabled)
      .map(([field]) => field);

    if (disabledFields.length > 0) {
      return `${prompt}\n\nNOTE: The user has disabled the following fields. Set them to null in your output: ${disabledFields.join(", ")}`;
    }
  }

  return prompt;
}
