import { DailyLog } from '@/types/log';
import { memoryStore } from '@/lib/store/memoryStore';

/**
 * Compute average score over the last N days (or all logs if N not provided).
 */
export function getAverageScore(lastNDays?: number): number {
  const logs = memoryStore.getAllLogs();
  if (logs.length === 0) return 0;
  const slice = lastNDays ? logs.slice(-lastNDays) : logs;
  const total = slice.reduce((sum, l) => sum + l.score, 0);
  return Math.round(total / slice.length);
}

/** Return dates (as strings) where score < 70 */
export function getFailDays(): string[] {
  return memoryStore
    .getAllLogs()
    .filter((l) => l.score < 70)
    .map((l) => l.date);
}

/**
 * Calculate the current streak of consecutive passing days (score >= 70) ending today.
 */
export function getStreak(): number {
  const logs = memoryStore.getAllLogs().sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].score >= 70) streak++;
    else break;
  }
  return streak;
}

/**
 * Projection: (average daily sales) * remaining days of the month.
 */
export function getProjection(): number {
  const logs = memoryStore.getAllLogs();
  if (logs.length === 0) return 0;
  const totalSales = logs.reduce((sum, l) => sum + l.sales, 0);
  const avgSales = totalSales / logs.length;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remaining = daysInMonth - today.getDate();
  return Math.round(avgSales * remaining);
}
