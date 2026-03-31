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
  saveDay: () => Promise<void>;

  // Computed
  totalSales: number;
  todayScore: number;
  isSaving: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [todayTasks, setTodayTasks] = useState<DayTasks>({ ...DEFAULT_TASKS });
  const [todaySales, setTodaySales] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data from API and settings
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        
        // Map data from API to AppContext types if needed
        const mappedLogs: DayLog[] = (data || []).map((l: any) => ({
          log_date: l.log_date,
          score: l.score,
          sales: l.sales,
          tasks: l.tasks,
          saved: true,
        }));
        
        setLogs(mappedLogs);
        
        // Load today's data if exists
        const today = formatDate(new Date());
        const todayEntry = mappedLogs.find((l) => l.log_date === today);
        if (todayEntry) {
          setTodayTasks(todayEntry.tasks);
          setTodaySales(todayEntry.sales);
        }
      } catch (e) {
        console.error('Error fetching logs:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchLogs();
    const storedSettings = getStoredSettings();
    if (storedSettings) setSettings(storedSettings);
  }, []);

  // Persist settings
  useEffect(() => {
    if (isLoaded) setStoredSettings(settings);
  }, [settings, isLoaded]);

  const todayScore = calculateScore(todayTasks);

  const todayLog: DayLog = {
    log_date: formatDate(new Date()),
    score: todayScore,
    sales: todaySales,
    tasks: todayTasks,
    saved: logs.some((l) => l.log_date === formatDate(new Date())),
  };

  const computedTotalSales = logs.reduce((sum, log) => {
    if (log.log_date === formatDate(new Date())) return sum;
    return sum + (log.sales || 0);
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

  const resetAllData = useCallback(async () => {
    // Optionally call reset endpoint in production
    setLogs([]);
    setTodayTasks({ ...DEFAULT_TASKS });
    setTodaySales(0);
  }, []);

  const updateTodayTasks = useCallback((tasks: DayTasks) => {
    setTodayTasks(tasks);
  }, []);

  const updateTodaySales = useCallback((sales: number) => {
    setTodaySales(sales);
  }, []);

  const saveDay = useCallback(async () => {
    setIsSaving(true);
    const todayStr = formatDate(new Date());
    const score = calculateScore(todayTasks);
    
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          sales: todaySales,
          tasks: todayTasks,
        }),
      });

      if (!response.ok) throw new Error('Failed to save log');
      
      const savedLog = await response.json();
      
      const newDayLog: DayLog = {
        log_date: todayStr,
        score,
        sales: todaySales,
        tasks: { ...todayTasks },
        saved: true,
      };

      setLogs((prev) => {
        const existing = prev.findIndex((l) => l.log_date === todayStr);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newDayLog;
          return updated;
        }
        return [...prev, newDayLog];
      });

    } catch (error) {
      console.error('Error saving day log:', error);
      alert('Error saving data to Supabase. Check console.');
    } finally {
      setIsSaving(false);
    }
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
        isSaving,
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
