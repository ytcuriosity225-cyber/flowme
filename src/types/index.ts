export interface BusinessWeek {
  id?: string;
  week_start_date: string; // YYYY-MM-DD (Monday)
  bottles_sold: number;
  creatives_count: number; // 0-3
  landing_page_test: boolean;
  insights_count: number; // 0-3
  system_improvement: boolean;
  is_success: boolean;
  created_at?: string;
}

export interface StudyTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface StudyWeek {
  id?: string;
  week_number: number;
  month_name: string;
  tasks: StudyTask[];
  score: number;
  created_at?: string;
}

export interface TechItem {
  id: string;
  title: string;
  youtubeId: string;
  phase: number;
  isCertification: boolean;
}

export interface TechProgress {
  id?: string;
  phase_id: number;
  video_id: string;
  is_completed: boolean;
  is_certification: boolean;
  next_unlocked: boolean;
  completed_at?: string;
}

export interface CalendarLog {
  id?: string;
  log_date: string;
  business_score: number;
  study_score: number;
  tech_score: number;
  created_at?: string;
}

export interface AppSettings {
  password: string;
  animationsEnabled: boolean;
  nightOwlMode: boolean;
  startDate: string; // YYYY-MM-DD
  goalSales: number;
  goalDays: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  password: "1234",
  animationsEnabled: true,
  nightOwlMode: false,
  startDate: "2026-04-01",
  goalSales: 300,
  goalDays: 30,
};
