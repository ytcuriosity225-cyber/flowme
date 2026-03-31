export interface DailyLog {
  id?: string;
  log_date: string;
  score: number;
  sales: number;
  tasks: any; // Using any for flexibility with JSONB, can be more specific later
  status?: 'pass' | 'fail';
  created_at?: string;
  saved?: boolean;
}
