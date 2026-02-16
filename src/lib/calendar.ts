import { createEvents, type EventAttributes } from "ics";
import type { SchoolEvent } from "./types";

function schoolEventToIcsAttributes(event: SchoolEvent): EventAttributes {
  const [year, month, day] = event.date.split("-").map(Number);

  const descriptionParts: string[] = [];
  if (event.notes) {
    descriptionParts.push(event.notes);
  }
  if (event.attire) {
    descriptionParts.push(`Attire: ${event.attire}`);
  }
  if (event.things_to_bring && event.things_to_bring.length > 0) {
    descriptionParts.push(
      `Things to bring:\n${event.things_to_bring.map((item) => `- ${item}`).join("\n")}`
    );
  }

  const base = {
    title: event.title,
    description: descriptionParts.join("\n\n"),
    location: event.location || undefined,
    categories: [event.event_type],
    status: "CONFIRMED" as const,
    busyStatus: "BUSY" as const,
    startInputType: "local" as const,
    startOutputType: "local" as const,
    alarms: [
      {
        action: "display" as const,
        description: "Reminder: 1 day before",
        trigger: { before: true, days: 1 },
      },
      {
        action: "display" as const,
        description: "Reminder: 30 minutes before",
        trigger: { before: true, minutes: 30 },
      },
    ],
  };

  if (event.is_all_day || !event.start_time) {
    return {
      ...base,
      start: [year, month, day],
      duration: { days: 1 },
    };
  }

  const [startHour, startMinute] = event.start_time.split(":").map(Number);

  if (event.end_time) {
    const [endHour, endMinute] = event.end_time.split(":").map(Number);
    return {
      ...base,
      start: [year, month, day, startHour, startMinute],
      end: [year, month, day, endHour, endMinute],
      endInputType: "local" as const,
      endOutputType: "local" as const,
    };
  }

  return {
    ...base,
    start: [year, month, day, startHour, startMinute],
    duration: { hours: 1 },
  };
}

export function generateIcsContent(events: SchoolEvent[]): string {
  if (events.length === 0) {
    throw new Error("No events to generate calendar for");
  }

  const icsEvents = events.map(schoolEventToIcsAttributes);
  const { error, value } = createEvents(icsEvents);

  if (error) {
    throw new Error(`Failed to generate calendar: ${error.message}`);
  }

  return value!;
}

function buildEventDescription(event: SchoolEvent): string {
  const parts: string[] = [];
  if (event.notes) parts.push(event.notes);
  if (event.attire) parts.push(`Attire: ${event.attire}`);
  if (event.things_to_bring && event.things_to_bring.length > 0) {
    parts.push(
      `Things to bring:\n${event.things_to_bring.map((item) => `- ${item}`).join("\n")}`
    );
  }
  return parts.join("\n\n");
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Generates a Google Calendar "Add Event" URL for a single event.
 * One tap on phone → opens Google Calendar with event pre-filled → user taps Save.
 * Works on both iPhone and Android.
 */
export function generateGoogleCalendarUrl(event: SchoolEvent): string {
  const [year, month, day] = event.date.split("-").map(Number);
  const description = buildEventDescription(event);

  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", event.title);

  if (event.is_all_day || !event.start_time) {
    // All-day format: YYYYMMDD/YYYYMMDD (next day)
    const startDate = `${year}${pad2(month)}${pad2(day)}`;
    const nextDay = new Date(year, month - 1, day + 1);
    const endDate = `${nextDay.getFullYear()}${pad2(nextDay.getMonth() + 1)}${pad2(nextDay.getDate())}`;
    params.set("dates", `${startDate}/${endDate}`);
  } else {
    // Timed format: YYYYMMDDTHHmmss/YYYYMMDDTHHmmss
    const [sh, sm] = event.start_time.split(":").map(Number);
    const startDt = `${year}${pad2(month)}${pad2(day)}T${pad2(sh)}${pad2(sm)}00`;

    if (event.end_time) {
      const [eh, em] = event.end_time.split(":").map(Number);
      const endDt = `${year}${pad2(month)}${pad2(day)}T${pad2(eh)}${pad2(em)}00`;
      params.set("dates", `${startDt}/${endDt}`);
    } else {
      // Default 1 hour
      const endH = sh + 1;
      const endDt = `${year}${pad2(month)}${pad2(day)}T${pad2(endH)}${pad2(sm)}00`;
      params.set("dates", `${startDt}/${endDt}`);
    }
  }

  if (description) params.set("details", description);
  if (event.location) params.set("location", event.location);
  params.set("ctz", "Asia/Singapore");

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  icsContent: string,
  filename: string = "school-events.ics"
): void {
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
