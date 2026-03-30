import { DayLog, DayTasks, TASK_DEFINITIONS, TaskKey } from "@/types";

const STORAGE_KEY = "flowme_sales_data";
const SETTINGS_KEY = "flowme_sales_settings";

export function getStoredLogs(): DayLog[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setStoredLogs(logs: DayLog[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getStoredSettings() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredSettings(settings: object): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function calculateScore(tasks: DayTasks): number {
  return TASK_DEFINITIONS.reduce((total, def) => {
    return total + (tasks[def.key] ? def.weight : 0);
  }, 0);
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#eab308";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "PASS";
  return "FAIL";
}

export function getScoreStatus(score: number): "pass" | "fail" {
  return score >= 70 ? "pass" : "fail";
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getDayNumber(startDate: string, currentDate: string): number {
  const start = new Date(startDate + "T00:00:00");
  const current = new Date(currentDate + "T00:00:00");
  const diff = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(1, diff + 1);
}

export function getProjection(
  totalSales: number,
  dayNumber: number,
  goalDays: number,
  goalSales: number
): { projected: number; status: "on-track" | "behind" | "risk" } {
  if (dayNumber === 0) return { projected: 0, status: "risk" };
  const avgPerDay = totalSales / dayNumber;
  const projected = Math.round(avgPerDay * goalDays);

  if (projected >= goalSales) return { projected, status: "on-track" };
  if (projected >= goalSales * 0.8) return { projected, status: "behind" };
  return { projected, status: "risk" };
}

export function getCompletedTaskLabels(tasks: DayTasks): string[] {
  return TASK_DEFINITIONS.filter((def) => tasks[def.key]).map((def) => def.label);
}

export function getTasksByCategory(category: "high" | "medium" | "low") {
  return TASK_DEFINITIONS.filter((def) => def.category === category);
}
