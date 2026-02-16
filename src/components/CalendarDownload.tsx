"use client";

import { downloadIcsFile, generateGoogleCalendarUrl } from "@/lib/calendar";
import type { SchoolEvent } from "@/lib/types";

interface CalendarDownloadProps {
  icsContent: string;
  eventCount: number;
  events: SchoolEvent[];
}

export function CalendarDownload({ icsContent, eventCount, events }: CalendarDownloadProps) {
  if (eventCount === 0) return null;

  return (
    <div className="sticky bottom-4 mt-6 space-y-2">
      {/* Google Calendar - primary action for mobile */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-3">
        <p className="text-xs font-medium text-gray-500 mb-2 text-center">
          Tap each event to add to Google Calendar
        </p>
        <div className="space-y-1.5">
          {events.map((event, i) => (
            <a
              key={`${event.date}-${i}`}
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-sm"
            >
              <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              <span className="text-blue-700 font-medium truncate">{event.title}</span>
              <span className="text-blue-500 text-xs shrink-0 ml-auto">
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ICS download - secondary option */}
      {icsContent && (
        <button
          onClick={() => downloadIcsFile(icsContent)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .ics file instead
        </button>
      )}
    </div>
  );
}
