"use client";

import { useState, useCallback } from "react";
import type {
  SchoolEvent,
  ExtractionRequest,
  ExtractionResponse,
  ExtractionStatus,
  UserSettings,
  ApiError,
} from "@/lib/types";

export function useExtraction() {
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [icsContent, setIcsContent] = useState<string>("");

  const extract = useCallback(
    async (
      images: string[],
      settings: UserSettings
    ): Promise<SchoolEvent[] | null> => {
      setStatus("extracting");
      setProgress(
        `Analyzing ${images.length} page${images.length > 1 ? "s" : ""} with AI...`
      );
      setError(null);
      setIcsContent("");

      try {
        const body: ExtractionRequest = {
          images,
          customPrompt: settings.customPrompt || undefined,
          enabledFields: settings.enabledFields,
        };

        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json();
          throw new Error(errorData.error || "Extraction failed");
        }

        const data: ExtractionResponse = await response.json();

        setStatus("success");
        setProgress(
          `Found ${data.events.length} event${data.events.length !== 1 ? "s" : ""}`
        );
        setIcsContent(data.icsContent);

        return data.events;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setStatus("error");
        setProgress("");
        setError(message);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress("");
    setError(null);
    setIcsContent("");
  }, []);

  return {
    status,
    progress,
    error,
    icsContent,
    extract,
    reset,
    isLoading: status === "extracting",
  };
}
