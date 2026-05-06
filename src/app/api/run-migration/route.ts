import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const s = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'public' }
  });

  const results: any[] = [];

  // Step 1: Check existing columns
  const { data: cols, error: colsErr } = await s.rpc('', {}).then(() => ({ data: null, error: null })).catch(() => ({ data: null, error: null }));

  // Try dropping and recreating tables via individual SQL statements through raw query
  // Since we can't run raw SQL through PostgREST, let's try to ALTER tables

  // Test: try to insert with all columns to see which ones are missing
  const { error: testErr } = await s.from('business_weeks').upsert({
    week_start_date: '2000-01-03',
    bottles_sold: 0,
    creatives_count: 0,
    landing_page_test: false,
    insights_count: 0,
    system_improvement: false,
    is_success: false
  }, { onConflict: 'week_start_date' }).select().single();

  if (testErr) {
    results.push({ step: 'test_insert', error: testErr.message, code: testErr.code });
    
    // The table exists but is missing columns - we need to recreate it
    // Unfortunately, PostgREST doesn't support DDL. 
    // We'll try to work around by using the table as-is or using pg_net extension
    
    // Let's check what we DO have
    const { data: existingData, error: selectErr } = await s.from('business_weeks').select('*').limit(0);
    results.push({ step: 'check_existing', error: selectErr?.message, hint: 'Table exists but columns mismatch. Migration needs to be run in Supabase SQL Editor.' });
  } else {
    results.push({ step: 'test_insert', success: true });
    // Cleanup
    await s.from('business_weeks').delete().eq('week_start_date', '2000-01-03');
  }

  // Test study_weeks
  const { error: studyErr } = await s.from('study_weeks').upsert({
    week_number: 99,
    month_name: 'TEST',
    tasks: [],
    score: 0
  }, { onConflict: 'month_name, week_number' }).select().single();
  results.push({ step: 'test_study', error: studyErr?.message || 'OK' });
  if (!studyErr) await s.from('study_weeks').delete().eq('month_name', 'TEST');

  // Test tech_progress
  const { error: techErr } = await s.from('tech_progress').upsert({
    phase_id: 99,
    video_id: 'TEST_VID',
    is_completed: false,
    is_certification: false,
    completed_at: null
  }, { onConflict: 'video_id' }).select().single();
  results.push({ step: 'test_tech', error: techErr?.message || 'OK' });
  if (!techErr) await s.from('tech_progress').delete().eq('video_id', 'TEST_VID');

  // Test calendar_logs
  const { error: calErr } = await s.from('calendar_logs').upsert({
    log_date: '2000-01-01',
    business_score: 0,
    study_score: 0,
    tech_score: 0
  }, { onConflict: 'log_date' }).select().single();
  results.push({ step: 'test_calendar', error: calErr?.message || 'OK' });
  if (!calErr) await s.from('calendar_logs').delete().eq('log_date', '2000-01-01');

  return NextResponse.json({ results, 
    action_required: results.some(r => r.error && r.error !== 'OK') 
      ? 'Run the migration.sql file in the Supabase SQL Editor to fix the schema'
      : 'All tables are working correctly'
  });
}
