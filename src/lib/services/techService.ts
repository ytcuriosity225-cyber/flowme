import { supabaseAdmin } from '@/lib/supabaseClient';
import { TechProgress } from '@/types';
import { updateCalendarFromTech } from './calendarService';

export async function getTechProgress(): Promise<TechProgress[]> {
  const { data, error } = await supabaseAdmin
    .from('tech_progress')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function markVideoComplete(phaseId: number, videoId: string, isCertification: boolean): Promise<TechProgress> {
  // On certification complete -> unlock next video/certification logic would happen in UI but here we save state
  const { data: progress, error } = await supabaseAdmin
    .from('tech_progress')
    .upsert({
      phase_id: phaseId,
      video_id: videoId,
      is_completed: true,
      is_certification: isCertification,
      completed_at: new Date().toISOString()
    }, { onConflict: 'video_id' })
    .select()
    .single();

  if (error) throw error;

  // Update calendar logs (maybe give a default score per video completion)
  await updateCalendarFromTech(progress);

  return progress;
}

export async function getPhaseUnlockStatus(phaseId: number): Promise<boolean> {
  // Example logic: if previous phase certification is completed
  if (phaseId === 1) return true; // Phase 1 is always unlocked
  
  const { data, error } = await supabaseAdmin
    .from('tech_progress')
    .select('is_completed')
    .eq('phase_id', phaseId - 1)
    .eq('is_certification', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.is_completed || false;
}
