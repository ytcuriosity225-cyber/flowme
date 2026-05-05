"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AppSettings,
  DEFAULT_SETTINGS,
} from "@/types";
import {
  getStoredSettings,
  setStoredSettings,
} from "@/lib/utils";

interface AppContextType {
  // Auth
  isUnlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings
  useEffect(() => {
    const storedSettings = getStoredSettings();
    if (storedSettings) setSettings(storedSettings);
    setIsLoaded(true);
  }, []);

  // Persist settings
  useEffect(() => {
    if (isLoaded) setStoredSettings(settings);
  }, [settings, isLoaded]);

  const unlock = useCallback(
    (password: string) => {
      if (password === settings.password) {
        setIsUnlocked(true);
        return true;
      }
      return false;
    },
    [settings.password]
  );

  const lock = useCallback(() => setIsUnlocked(false), []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetAllData = useCallback(async () => {
    // Reset core settings if needed
    setSettings(DEFAULT_SETTINGS);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-text-muted border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        isUnlocked,
        unlock,
        lock,
        settings,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
