import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
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
  const status = score >= 70 ? 'pass' : 'fail';

  // Use supabaseAdmin for upsert to bypass RLS if needed
  const { data: log, error } = await supabaseAdmin
    .from('daily_logs')
    .upsert({
      log_date: data.date,
      score,
      sales: data.sales,
      tasks: data.tasks,
      status: status,
    }, { onConflict: 'log_date' })
    .select()
    .single();

  if (error) {
    console.error('Supabase Upsert Error:', error);
    throw error;
  }

  return { ...log, saved: true } as DailyLog;
}

export async function getLog(date: string): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('log_date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for "no rows found"
  return data ? ({ ...data, saved: true } as DailyLog) : null;
}

export async function getAllLogs(): Promise<DailyLog[]> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .order('log_date', { ascending: true });

  if (error) throw error;
  return (data || []).map((log) => ({ ...log, saved: true } as DailyLog));
}

export async function resetLogs(): Promise<void> {
  // Danger zone: Resetting logs using admin client
  const { error } = await supabaseAdmin.from('daily_logs').delete().neq('id', 'placeholder-to-allow-delete-all');
  if (error) throw error;
}
