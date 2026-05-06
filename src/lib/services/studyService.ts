import { supabaseAdmin } from '@/lib/supabaseClient';
import { StudyWeek, StudyTask } from '@/types';
import { updateCalendarFromStudy } from './calendarService';

export async function getStudyWeek(weekNumber: number, month: string = 'May'): Promise<StudyWeek | null> {
  const { data, error } = await supabaseAdmin
    .from('study_weeks')
    .select('*')
    .eq('week_number', weekNumber)
    .eq('month_name', month)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveStudyWeek(data: Omit<StudyWeek, 'id' | 'created_at'>): Promise<StudyWeek> {
  // Score = (completed tasks / total tasks) * 100
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const { data: week, error } = await supabaseAdmin
    .from('study_weeks')
    .upsert({ ...data, score }, { onConflict: 'month_name, week_number' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error saving study week:', error);
    throw error;
  }

  // Update calendar logs
  await updateCalendarFromStudy(week);

  return week;
}

export async function getAllStudyWeeks(month: string = 'May'): Promise<StudyWeek[]> {
  const { data, error } = await supabaseAdmin
    .from('study_weeks')
    .select('*')
    .eq('month_name', month)
    .order('week_number', { ascending: true });

  if (error) throw error;
  return data || [];
}
