export interface DailyLog {
  id?: string;
  log_date: string;
  score: number;
  sales: number;
  tasks: any;
  status: string;
  created_at?: string;
  saved?: boolean;
}
