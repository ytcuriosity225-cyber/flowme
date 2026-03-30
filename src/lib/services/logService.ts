import { supabase } from '@/lib/supabaseClient';
import { DailyLog } from '@/types/log';
import { DayTasks } from '@/types';
import { calculateScore } from '@/lib/services/scoreService';

/**
 * Create or update a daily log in Supabase.
 */
export async function createOrUpdateLog(data: {
  date: string;
  sales: number;
  tasks: DayTasks;
}): Promise<DailyLog> {
  const score = calculateScore(data.tasks);
  const { data: log, error } = await supabase
    .from('daily_logs')
    .upsert({
      date: data.date,
      score,
      sales: data.sales,
      tasks: data.tasks,
      status: score >= 70 ? 'pass' : 'fail',
    }, { onConflict: 'date', returning: 'representation' })
    .single();
  if (error) throw error;
  return { ...log, saved: true } as DailyLog;
}

export async function getLog(date: string): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('date', date)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // no row found
  return data ? ({ ...data, saved: true } as DailyLog) : null;
}

export async function getAllLogs(): Promise<DailyLog[]> {
  const { data, error } = await supabase.from('daily_logs').select('*').order('date');
  if (error) throw error;
  return data.map((log) => ({ ...log, saved: true } as DailyLog));
}

export async function resetLogs(): Promise<void> {
  const { error } = await supabase.from('daily_logs').delete().neq('id', '');
  if (error) throw error;
}
