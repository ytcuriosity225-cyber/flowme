export interface DailyLog {
  date: string;
  score: number;
  sales: number;
  tasks: Record<string, boolean>;
  saved?: boolean;
}
