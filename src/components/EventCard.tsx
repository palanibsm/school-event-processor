"use client";

import { useState } from "react";
import type { SchoolEvent, EventType } from "@/lib/types";
import { generateGoogleCalendarUrl } from "@/lib/calendar";

const EVENT_TYPE_STYLES: Record<EventType, { bg: string; text: string; label: string }> = {
  exam: { bg: "bg-red-100", text: "text-red-800", label: "Exam" },
  field_trip: { bg: "bg-green-100", text: "text-green-800", label: "Field Trip" },
  celebration: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Celebration" },
  meeting: { bg: "bg-blue-100", text: "text-blue-800", label: "Meeting" },
  workshop: { bg: "bg-purple-100", text: "text-purple-800", label: "Workshop" },
  holiday: { bg: "bg-orange-100", text: "text-orange-800", label: "Holiday" },
  deadline: { bg: "bg-pink-100", text: "text-pink-800", label: "Deadline" },
  other: { bg: "bg-gray-100", text: "text-gray-800", label: "Other" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

interface EventCardProps {
  event: SchoolEvent;
  onUpdate: (updated: SchoolEvent) => void;
  onDelete: () => void;
}

export function EventCard({ event, onUpdate, onDelete }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.other;

  const timeStr = event.is_all_day
    ? "All day"
    : event.start_time
      ? `${formatTime(event.start_time)}${event.end_time ? ` - ${formatTime(event.end_time)}` : ""}`
      : "";

  const handleFieldEdit = (field: keyof SchoolEvent, value: string) => {
    setEditing(null);
    if (field === "things_to_bring") {
      onUpdate({
        ...event,
        things_to_bring: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } else {
      onUpdate({ ...event, [field]: value || null });
    }
  };

  const EditableField = ({
    field,
    value,
    label,
  }: {
    field: keyof SchoolEvent;
    value: string;
    label: string;
  }) => {
    if (editing === field) {
      return (
        <input
          autoFocus
          className="text-sm w-full border-b border-blue-400 bg-transparent outline-none py-0.5"
          defaultValue={value}
          onBlur={(e) => handleFieldEdit(field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFieldEdit(field, e.currentTarget.value);
            if (e.key === "Escape") setEditing(null);
          }}
        />
      );
    }
    return (
      <span
        className="cursor-pointer hover:bg-gray-100 rounded px-0.5 -mx-0.5"
        onClick={(e) => {
          e.stopPropagation();
          setEditing(field);
        }}
        title={`Click to edit ${label}`}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
              >
                {style.label}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {event.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              {timeStr && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeStr}
                </span>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2.5 text-sm">
          {event.location && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Location</span>
                <p className="text-gray-700">
                  <EditableField field="location" value={event.location} label="location" />
                </p>
              </div>
            </div>
          )}

          {event.attire && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Attire</span>
                <p className="text-gray-700">
                  <EditableField field="attire" value={event.attire} label="attire" />
                </p>
              </div>
            </div>
          )}

          {event.things_to_bring && event.things_to_bring.length > 0 && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Things to Bring</span>
                <ul className="text-gray-700 list-disc list-inside">
                  {event.things_to_bring.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {event.notes && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Important Notes</span>
                <p className="text-gray-700 whitespace-pre-line">
                  <EditableField field="notes" value={event.notes} label="notes" />
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              Add to Google Calendar
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
