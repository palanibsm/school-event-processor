"use client";

import { useCallback, useRef, useState } from "react";
import { renderPdfToImages } from "@/lib/pdf-to-images";

interface PdfUploaderProps {
  onPdfProcessed: (images: string[], fileName: string) => void;
  isProcessing: boolean;
}

export function PdfUploader({ onPdfProcessed, isProcessing }: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.type !== "application/pdf") {
        setError("Please select a PDF file.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError("File size must be under 20MB.");
        return;
      }

      try {
        setRendering(true);
        const arrayBuffer = await file.arrayBuffer();
        const images = await renderPdfToImages(arrayBuffer);
        onPdfProcessed(images, file.name);
      } catch {
        setError("Failed to process PDF. Please try another file.");
      } finally {
        setRendering(false);
      }
    },
    [onPdfProcessed]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const busy = rendering || isProcessing;

  return (
    <div className="mb-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
          ${busy ? "opacity-60 pointer-events-none" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {rendering ? (
          <>
            <svg
              className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm text-gray-600">Rendering PDF pages...</p>
          </>
        ) : (
          <>
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-base font-medium text-gray-700 mb-1">
              Tap to upload a PDF
            </p>
            <p className="text-sm text-gray-500">
              from ParentsGateway or your files
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
