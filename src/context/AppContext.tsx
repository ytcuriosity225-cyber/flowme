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

export type ThemeCode = "cyber-green" | "plasma-blue" | "red-sector" | "amber-alert";

interface AppContextType {
  // Auth
  isUnlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Theming
  theme: ThemeCode;
  setTheme: (theme: ThemeCode) => void;
}

const THEME_KEY = "neuroflow_theme";

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setThemeState] = useState<ThemeCode>("cyber-green");

  // Load settings + theme
  useEffect(() => {
    const storedSettings = getStoredSettings();
    if (storedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...storedSettings });
    }

    // Load saved theme
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(THEME_KEY) as ThemeCode | null;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "cyber-green");
      }
    }

    setIsLoaded(true);
  }, []);

  // Persist settings
  useEffect(() => {
    if (isLoaded) setStoredSettings(settings);
  }, [settings, isLoaded]);

  const setTheme = useCallback((newTheme: ThemeCode) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, newTheme);
    }
  }, []);

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
    setSettings(DEFAULT_SETTINGS);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050508" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-5 h-5 border-2 border-sys-tech border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: "#00FF41" }}>
            INITIALIZING NEURO-FLOW OS...
          </span>
        </div>
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
        theme,
        setTheme,
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
