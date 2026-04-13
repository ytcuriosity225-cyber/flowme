export interface DayTasks {
  adOperations: boolean;
  salesCodOps: boolean;
  websiteCopyOptimization: boolean;
  creativeProduction: boolean;
  sheryiansCoding: boolean;
  projectBuild: boolean;
  codingLogicChallenge: boolean;
  bookReading: boolean;
  personalBrandContent: boolean;
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
  nightOwlMode: boolean;
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
  // HIGH IMPACT - BUSINESS & MARKETING (15 pts each = 60)
  { key: "adOperations", label: "Ad Operations (Run/Optimize)", weight: 15, category: "high" },
  { key: "salesCodOps", label: "Sales & COD Care Operations", weight: 15, category: "high" },
  { key: "websiteCopyOptimization", label: "Website Copy & Offer Optimization", weight: 15, category: "high" },
  { key: "creativeProduction", label: "Creative Production (Weekly Assets)", weight: 15, category: "high" },
  // MEDIUM IMPACT - TECH BEAST (10 pts each = 30)
  { key: "sheryiansCoding", label: "Sheryians Coding Session (JS/Backend)", weight: 10, category: "medium" },
  { key: "projectBuild", label: "Project Build (Social Media Limiter)", weight: 10, category: "medium" },
  { key: "codingLogicChallenge", label: "Coding Logic Challenge (Problem Solving)", weight: 10, category: "medium" },
  // LOW IMPACT - PERSONAL BRAND & GROWTH (5 pts each = 15)
  { key: "bookReading", label: "Marketing Book Reading (Sell Like Crazy)", weight: 5, category: "low" },
  { key: "personalBrandContent", label: "Personal Brand Content (Script/Shoot/Edit)", weight: 5, category: "low" },
  { key: "experienceJournal", label: "Experience Journal & Daily Learning", weight: 5, category: "low" },
];

export const DEFAULT_TASKS: DayTasks = {
  adOperations: false,
  salesCodOps: false,
  websiteCopyOptimization: false,
  creativeProduction: false,
  sheryiansCoding: false,
  projectBuild: false,
  codingLogicChallenge: false,
  bookReading: false,
  personalBrandContent: false,
  experienceJournal: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  password: "1234",
  animationsEnabled: true,
  nightOwlMode: false,
  startDate: "2026-04-01",
  goalSales: 300,
  goalDays: 30,
};
