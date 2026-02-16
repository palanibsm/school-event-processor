export type EventType =
  | "exam"
  | "field_trip"
  | "celebration"
  | "meeting"
  | "workshop"
  | "holiday"
  | "deadline"
  | "other";

export interface SchoolEvent {
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM 24-hour
  end_time: string | null; // HH:MM 24-hour
  location: string | null;
  event_type: EventType;
  attire: string | null;
  things_to_bring: string[] | null;
  notes: string | null;
  is_all_day: boolean;
}

export interface ExtractionRequest {
  images: string[]; // base64 PNG/JPEG data URLs
  customPrompt?: string;
  enabledFields?: EnabledFields;
}

export interface ExtractionResponse {
  events: SchoolEvent[];
  icsContent: string;
}

export interface ApiError {
  error: string;
}

export interface EnabledFields {
  title: boolean;
  date: boolean;
  start_time: boolean;
  end_time: boolean;
  location: boolean;
  event_type: boolean;
  attire: boolean;
  things_to_bring: boolean;
  notes: boolean;
  is_all_day: boolean;
}

export const DEFAULT_ENABLED_FIELDS: EnabledFields = {
  title: true,
  date: true,
  start_time: true,
  end_time: true,
  location: true,
  event_type: true,
  attire: true,
  things_to_bring: true,
  notes: true,
  is_all_day: true,
};

export interface UserSettings {
  customPrompt: string | null;
  enabledFields: EnabledFields;
}

export type ExtractionStatus =
  | "idle"
  | "rendering_pdf"
  | "extracting"
  | "success"
  | "error";
