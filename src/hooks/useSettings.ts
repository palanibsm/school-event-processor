"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserSettings, EnabledFields } from "@/lib/types";
import { DEFAULT_ENABLED_FIELDS } from "@/lib/types";
import { loadSettings, saveSettings } from "@/lib/storage";

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    customPrompt: null,
    enabledFields: DEFAULT_ENABLED_FIELDS,
  });

  useEffect(() => {
    const saved = loadSettings();
    if (saved) setSettings(saved);
  }, []);

  const updatePrompt = useCallback((prompt: string | null) => {
    setSettings((prev) => {
      const next = { ...prev, customPrompt: prompt };
      saveSettings(next);
      return next;
    });
  }, []);

  const updateFormat = useCallback((fields: EnabledFields) => {
    setSettings((prev) => {
      const next = { ...prev, enabledFields: fields };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updatePrompt, updateFormat };
}
