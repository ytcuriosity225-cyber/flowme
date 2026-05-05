import { supabaseAdmin } from '@/lib/supabaseClient';
import { CalendarLog, BusinessWeek, StudyWeek, TechProgress } from '@/types';

export async function getCalendarLogs(dateRange?: { start: string, end: string }): Promise<CalendarLog[]> {
  let query = supabaseAdmin.from('calendar_logs').select('*');
  
  if (dateRange) {
    query = query.gte('log_date', dateRange.start).lte('log_date', dateRange.end);
  }

  const { data, error } = await query.order('log_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function updateCalendarFromBusiness(week: BusinessWeek) {
  // Update the 7 days of this week with the business score
  const score = week.is_success ? 100 : 0;
  
  const start = new Date(week.week_start_date);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    await supabaseAdmin.rpc('update_calendar_log', { 
      p_date: dateStr, 
      p_business_score: score 
    });
  }
}

export async function updateCalendarFromStudy(week: StudyWeek) {
  // Map week_number to date range in May 2026
  // Week 1: May 1-7
  // Week 2: May 8-14
  // Week 3: May 15-21
  // Week 4: May 22-31
  const ranges: Record<number, {start: number, end: number}> = {
    1: { start: 1, end: 7 },
    2: { start: 8, end: 14 },
    3: { start: 15, end: 21 },
    4: { start: 22, end: 31 }
  };

  const range = ranges[week.week_number];
  if (!range) return;

  for (let d = range.start; d <= range.end; d++) {
    const dateStr = `2026-05-${d.toString().padStart(2, '0')}`;
    await supabaseAdmin.rpc('update_calendar_log', { 
      p_date: dateStr, 
      p_study_score: week.score 
    });
  }
}

export async function updateCalendarFromTech(progress: TechProgress) {
  const dateStr = new Date().toISOString().split('T')[0];
  // Calculate a "Tech Score" based on overall progress (placeholder)
  await supabaseAdmin.rpc('update_calendar_log', { 
    p_date: dateStr, 
    p_tech_score: 100 
  });
}
