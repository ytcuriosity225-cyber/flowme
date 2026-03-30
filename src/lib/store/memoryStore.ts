import { DailyLog } from '@/types/log';

/**
 * Simple in‑memory store for daily logs.
 * Uses a Map keyed by date string (YYYY‑MM‑DD).
 * Replace with Supabase queries later – see TODO comments.
 */
class MemoryStore {
  private store: Map<string, DailyLog> = new Map();

  /** Get all logs as an array */
  getAllLogs(): DailyLog[] {
    return Array.from(this.store.values());
  }

  /** Get a single log by date */
  getLogByDate(date: string): DailyLog | undefined {
    return this.store.get(date);
  }

  /** Save or update a log */
  saveLog(log: DailyLog): void {
    this.store.set(log.date, log);
  }

  /** Reset the entire store */
  resetAll(): void {
    this.store.clear();
  }
}

// Export a singleton instance for app‑wide use
export const memoryStore = new MemoryStore();

// TODO: Replace MemoryStore implementation with Supabase client queries when ready.
