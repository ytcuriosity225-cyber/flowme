import { DailyLog } from '@/types/log';

/**
 * Compute average score over a list of logs.
 */
export function getAverageScore(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const total = logs.reduce((sum, l) => sum + (l.score || 0), 0);
  return Math.round(total / logs.length);
}

/** Return dates (as strings) where score < 70 */
export function getFailDays(logs: DailyLog[]): string[] {
  return logs
    .filter((l) => (l.score || 0) < 70)
    .map((l) => l.log_date);
}

/**
 * Calculate the current streak of consecutive passing days (score >= 70) ending with the latest log.
 */
export function getStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const sortedLogs = [...logs].sort((a, b) => a.log_date.localeCompare(b.log_date));
  let streak = 0;
  for (let i = sortedLogs.length - 1; i >= 0; i--) {
    if ((sortedLogs[i].score || 0) >= 70) streak++;
    else break;
  }
  return streak;
}

/**
 * Projection: (average daily sales) * remaining days of the month.
 */
export function getProjection(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const totalSales = logs.reduce((sum, l) => sum + (l.sales || 0), 0);
  const avgSales = totalSales / logs.length;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remaining = daysInMonth - today.getDate();
  return Math.round(avgSales * (remaining > 0 ? remaining : 0));
}
