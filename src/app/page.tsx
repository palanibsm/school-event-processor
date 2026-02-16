"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { PdfUploader } from "@/components/PdfUploader";
import { PdfPreview } from "@/components/PdfPreview";
import { EventList } from "@/components/EventList";
import { CalendarDownload } from "@/components/CalendarDownload";
import { PromptEditor } from "@/components/PromptEditor";
import { FormatEditor } from "@/components/FormatEditor";
import { LoadingState } from "@/components/LoadingState";
import { useExtraction } from "@/hooks/useExtraction";
import { useSettings } from "@/hooks/useSettings";
import type { SchoolEvent } from "@/lib/types";

type SettingsView = "prompt" | "format" | null;

export default function Home() {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [settingsView, setSettingsView] = useState<SettingsView>(null);

  const { settings, updatePrompt, updateFormat } = useSettings();
  const { extract, isLoading, status, progress, error, icsContent, reset } =
    useExtraction();

  const handlePdfProcessed = (images: string[], name: string) => {
    setPageImages(images);
    setFileName(name);
    setEvents([]);
    reset();
  };

  const handleExtract = async () => {
    const result = await extract(pageImages, settings);
    if (result) setEvents(result);
  };

  const handleEventUpdate = (index: number, updated: SchoolEvent) => {
    setEvents((prev) => prev.map((e, i) => (i === index ? updated : e)));
  };

  const handleEventDelete = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header
        onSettingsClick={() =>
          setSettingsView(settingsView ? null : "prompt")
        }
      />

      <PdfUploader
        onPdfProcessed={handlePdfProcessed}
        isProcessing={isLoading}
      />

      <PdfPreview images={pageImages} fileName={fileName} />

      {pageImages.length > 0 && status !== "success" && !isLoading && (
        <button
          onClick={handleExtract}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow transition-colors active:scale-[0.98] mb-4"
        >
          Extract Events
        </button>
      )}

      {isLoading && <LoadingState progress={progress} />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={handleExtract}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <EventList
            events={events}
            onUpdateEvent={handleEventUpdate}
            onDeleteEvent={handleEventDelete}
          />
          <CalendarDownload
            icsContent={icsContent}
            eventCount={events.length}
            events={events}
          />
        </>
      )}

      {settingsView && (
        <div className="fixed inset-0 z-40">
          {/* Settings tab bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="w-full max-w-lg pointer-events-auto">
              {settingsView === "prompt" ? (
                <PromptEditor
                  currentPrompt={settings.customPrompt}
                  onSave={updatePrompt}
                  onClose={() => setSettingsView(null)}
                />
              ) : (
                <FormatEditor
                  currentFields={settings.enabledFields}
                  onSave={updateFormat}
                  onClose={() => setSettingsView(null)}
                />
              )}
            </div>
          </div>

          {/* Tab selector overlay */}
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-16">
            <div className="bg-white rounded-full shadow-lg border border-gray-200 flex p-1 gap-1">
              <button
                onClick={() => setSettingsView("prompt")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  settingsView === "prompt"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Prompt
              </button>
              <button
                onClick={() => setSettingsView("format")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  settingsView === "format"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Output Fields
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
