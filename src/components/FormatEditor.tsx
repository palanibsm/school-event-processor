"use client";

import { useState } from "react";
import type { EnabledFields } from "@/lib/types";
import { DEFAULT_ENABLED_FIELDS } from "@/lib/types";

const FIELD_LABELS: Record<keyof EnabledFields, { label: string; description: string; required?: boolean }> = {
  title: { label: "Title", description: "Event name", required: true },
  date: { label: "Date", description: "Event date", required: true },
  start_time: { label: "Start Time", description: "Event start time" },
  end_time: { label: "End Time", description: "Event end time" },
  location: { label: "Location", description: "Venue or platform" },
  event_type: { label: "Event Type", description: "Category (exam, field trip, etc.)" },
  attire: { label: "Attire", description: "Required dress code" },
  things_to_bring: { label: "Things to Bring", description: "Packing checklist" },
  notes: { label: "Notes", description: "Important reminders" },
  is_all_day: { label: "All Day Flag", description: "Whether event spans full day" },
};

interface FormatEditorProps {
  currentFields: EnabledFields;
  onSave: (fields: EnabledFields) => void;
  onClose: () => void;
}

export function FormatEditor({ currentFields, onSave, onClose }: FormatEditorProps) {
  const [fields, setFields] = useState<EnabledFields>({ ...currentFields });

  const toggleField = (key: keyof EnabledFields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold">Output Fields</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <p className="text-xs text-gray-500 mb-3">
            Choose which fields to extract from school PDFs. Disabled fields
            will not be included in the AI extraction.
          </p>
          <div className="space-y-1">
            {(Object.keys(FIELD_LABELS) as (keyof EnabledFields)[]).map((key) => {
              const config = FIELD_LABELS[key];
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${
                    config.required ? "opacity-75" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={fields[key]}
                    disabled={config.required}
                    onChange={() => toggleField(key)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {config.label}
                      {config.required && (
                        <span className="text-xs text-gray-400 ml-1">(required)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setFields({ ...DEFAULT_ENABLED_FIELDS });
              onSave(DEFAULT_ENABLED_FIELDS);
            }}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={() => {
              onSave(fields);
              onClose();
            }}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
