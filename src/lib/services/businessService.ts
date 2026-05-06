import { supabaseAdmin } from '@/lib/supabaseClient';
import { BusinessWeek } from '@/types';
import { updateCalendarFromBusiness } from './calendarService';

export async function getBusinessWeek(mondayDate: string): Promise<BusinessWeek | null> {
  const { data, error } = await supabaseAdmin
    .from('business_weeks')
    .select('*')
    .eq('week_start_date', mondayDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveBusinessWeek(data: Omit<BusinessWeek, 'id' | 'created_at'>): Promise<BusinessWeek> {
  // Rule: All completed = success week
  const isSuccess = 
    data.creatives_count >= 3 && 
    data.landing_page_test && 
    data.insights_count >= 3 && 
    data.system_improvement;

  const { data: week, error } = await supabaseAdmin
    .from('business_weeks')
    .upsert({ ...data, is_success: isSuccess }, { onConflict: 'week_start_date' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error saving business week:', error);
    throw error;
  }

  // Update calendar logs
  await updateCalendarFromBusiness(week);

  return week;
}

export async function getAllBusinessWeeks(): Promise<BusinessWeek[]> {
  const { data, error } = await supabaseAdmin
    .from('business_weeks')
    .select('*')
    .order('week_start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}
