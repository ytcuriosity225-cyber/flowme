export interface DayTasks {
  runAds: boolean;
  gotSales: boolean;
  codCare: boolean;
  clientFollowUp: boolean;
  creativesWork: boolean;
  objectionHandling: boolean;
  landingPageWork: boolean;
  systemCheck: boolean;
  learning: boolean;
  experienceJournal: boolean;
}

export interface DayLog {
  log_date: string; // YYYY-MM-DD
  score: number;
  sales: number;
  tasks: any;
  status: string;
  saved: boolean;
}

export interface AppSettings {
  password: string;
  animationsEnabled: boolean;
  startDate: string; // YYYY-MM-DD
  goalSales: number;
  goalDays: number;
}

export type TaskKey = keyof DayTasks;

export interface TaskDefinition {
  key: TaskKey;
  label: string;
  weight: number;
  category: "high" | "medium" | "low";
}

export const TASK_DEFINITIONS: TaskDefinition[] = [
  // HIGH IMPACT (15 pts each = 60)
  { key: "runAds", label: "Run Ads", weight: 15, category: "high" },
  { key: "gotSales", label: "Got Sales", weight: 15, category: "high" },
  { key: "codCare", label: "COD Care", weight: 15, category: "high" },
  { key: "clientFollowUp", label: "Client Follow-up", weight: 15, category: "high" },
  // MEDIUM IMPACT (7 pts each = 28)
  { key: "creativesWork", label: "Creatives Work", weight: 7, category: "medium" },
  { key: "objectionHandling", label: "Objection Handling", weight: 7, category: "medium" },
  { key: "landingPageWork", label: "Landing Page Work", weight: 7, category: "medium" },
  { key: "systemCheck", label: "System Check", weight: 7, category: "medium" },
  // LOW IMPACT (6 pts each = 12)
  { key: "learning", label: "Learning", weight: 6, category: "low" },
  { key: "experienceJournal", label: "Experience Journal", weight: 6, category: "low" },
];

export const DEFAULT_TASKS: DayTasks = {
  runAds: false,
  gotSales: false,
  codCare: false,
  clientFollowUp: false,
  creativesWork: false,
  objectionHandling: false,
  landingPageWork: false,
  systemCheck: false,
  learning: false,
  experienceJournal: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  password: "1234",
  animationsEnabled: true,
  startDate: "2026-04-01",
  goalSales: 300,
  goalDays: 30,
};
