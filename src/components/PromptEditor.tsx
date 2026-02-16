"use client";

import { useState } from "react";
import { DEFAULT_PROMPT } from "@/lib/prompts";

interface PromptEditorProps {
  currentPrompt: string | null;
  onSave: (prompt: string | null) => void;
  onClose: () => void;
}

export function PromptEditor({ currentPrompt, onSave, onClose }: PromptEditorProps) {
  const [value, setValue] = useState(currentPrompt || DEFAULT_PROMPT);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold">Extraction Prompt</h2>
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
            Customize how AI extracts events from your school PDFs. This prompt
            is sent to GPT-4o along with the PDF images.
          </p>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-64 text-sm font-mono border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your custom prompt..."
          />
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setValue(DEFAULT_PROMPT);
              onSave(null);
            }}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={() => {
              onSave(value === DEFAULT_PROMPT ? null : value);
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
