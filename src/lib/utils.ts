const SETTINGS_KEY = "neuroflow_os_settings";

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
