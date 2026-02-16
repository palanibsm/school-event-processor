"use client";

import type { SchoolEvent } from "@/lib/types";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: SchoolEvent[];
  onUpdateEvent: (index: number, updated: SchoolEvent) => void;
  onDeleteEvent: (index: number) => void;
}

export function EventList({ events, onUpdateEvent, onDeleteEvent }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-12 h-12 mx-auto text-gray-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-sm text-gray-500">No events found in this PDF.</p>
        <p className="text-xs text-gray-400 mt-1">
          Try adjusting the extraction prompt in settings.
        </p>
      </div>
    );
  }

  // Sort events by date
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">
        {events.length} event{events.length !== 1 ? "s" : ""} found
      </p>
      {sorted.map((event, i) => {
        const originalIndex = events.indexOf(event);
        return (
          <EventCard
            key={`${event.date}-${event.title}-${i}`}
            event={event}
            onUpdate={(updated) => onUpdateEvent(originalIndex, updated)}
            onDelete={() => onDeleteEvent(originalIndex)}
          />
        );
      })}
    </div>
  );
}
