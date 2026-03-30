"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DayLog,
  DayTasks,
  AppSettings,
  DEFAULT_SETTINGS,
  DEFAULT_TASKS,
} from "@/types";
import {
  getStoredLogs,
  setStoredLogs,
  getStoredSettings,
  setStoredSettings,
  formatDate,
} from "@/lib/utils";
import { calculateScore } from "@/lib/services/scoreService";

interface AppContextType {
  // Auth
  isUnlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Day logs
  logs: DayLog[];
  todayLog: DayLog;
  updateTodayTasks: (tasks: DayTasks) => void;
  updateTodaySales: (sales: number) => void;
  saveDay: () => void;

  // Computed
  totalSales: number;
  todayScore: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [todayTasks, setTodayTasks] = useState<DayTasks>({ ...DEFAULT_TASKS });
  const [todaySales, setTodaySales] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from API and settings
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
        // Load today's data if exists
        const today = formatDate(new Date());
        const todayEntry = data.find((l: any) => l.date === today);
        if (todayEntry) {
          setTodayTasks(todayEntry.tasks);
          setTodaySales(todayEntry.sales);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
    const storedSettings = getStoredSettings();
    if (storedSettings) setSettings(storedSettings);
    setIsLoaded(true);
  }, []);

  // Persist logs
  useEffect(() => {
    if (isLoaded) setStoredLogs(logs);
  }, [logs, isLoaded]);

  // Persist settings
  useEffect(() => {
    if (isLoaded) setStoredSettings(settings);
  }, [settings, isLoaded]);

  const todayScore = calculateScore(todayTasks);

  const todayLog: DayLog = {
    date: formatDate(new Date()),
    score: todayScore,
    sales: todaySales,
    tasks: todayTasks,
    saved: logs.some((l) => l.date === formatDate(new Date()) && l.saved),
  };

  const totalSales = logs.reduce((sum, l) => sum + l.sales, 0) +
    (logs.some((l) => l.date === formatDate(new Date())) ? 0 : todaySales);

  const computedTotalSales = logs.reduce((sum, log) => {
    if (log.date === formatDate(new Date())) return sum;
    return sum + log.sales;
  }, 0) + todaySales;

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

  const resetAllData = useCallback(() => {
    setLogs([]);
    setTodayTasks({ ...DEFAULT_TASKS });
    setTodaySales(0);
    localStorage.removeItem("flowme_sales_data");
  }, []);

  const updateTodayTasks = useCallback((tasks: DayTasks) => {
    setTodayTasks(tasks);
  }, []);

  const updateTodaySales = useCallback((sales: number) => {
    setTodaySales(sales);
  }, []);

  const saveDay = useCallback(() => {
    const today = formatDate(new Date());
    const score = calculateScore(todayTasks);
    const newLog: DayLog = {
      date: today,
      score,
      sales: todaySales,
      tasks: { ...todayTasks },
      saved: true,
    };

    setLogs((prev) => {
      const existing = prev.findIndex((l) => l.date === today);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newLog;
        return updated;
      }
      return [...prev, newLog];
    });
  }, [todayTasks, todaySales]);

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
        logs,
        todayLog,
        updateTodayTasks,
        updateTodaySales,
        saveDay,
        totalSales: computedTotalSales,
        todayScore,
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
