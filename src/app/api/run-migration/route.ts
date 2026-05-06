import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

/**
 * GET /api/run-migration
 * Applies the schema migration by dropping and recreating tables.
 * Uses individual PostgREST-compatible operations.
 * NOTE: Since PostgREST cannot run DDL, this endpoint tests connectivity
 * and provides the SQL that must be run in the Supabase SQL Editor.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, { status: string; message?: string }> = {};

  // Test each table with a probe insert
  const tables = ['business_weeks', 'study_weeks', 'tech_progress', 'calendar_logs'];
  
  for (const table of tables) {
    const { error } = await supabaseAdmin.from(table).select('*').limit(1);
    results[table] = error ? { status: 'ERROR', message: error.message } : { status: 'OK' };
  }

  // Test business_weeks columns specifically
  const { error: bwErr } = await supabaseAdmin
    .from('business_weeks')
    .upsert({
      week_start_date: '1999-01-04',
      bottles_sold: 0,
      creatives_count: 0,
      landing_page_test: false,
      insights_count: 0,
      system_improvement: false,
      is_success: false,
    }, { onConflict: 'week_start_date' })
    .select()
    .single();

  if (bwErr) {
    results.business_weeks_columns = { status: 'SCHEMA_MISMATCH', message: bwErr.message };
  } else {
    results.business_weeks_columns = { status: 'OK' };
    await supabaseAdmin.from('business_weeks').delete().eq('week_start_date', '1999-01-04');
  }

  // Test RPC
  const { error: rpcErr } = await supabaseAdmin.rpc('update_calendar_log', {
    p_date: '1999-01-01',
    p_business_score: 0,
  });
  results.rpc_update_calendar_log = rpcErr 
    ? { status: 'MISSING', message: rpcErr.message } 
    : { status: 'OK' };
  
  if (!rpcErr) {
    await supabaseAdmin.from('calendar_logs').delete().eq('log_date', '1999-01-01');
  }

  const hasMismatch = Object.values(results).some((r: any) => r.status !== 'OK');

  return NextResponse.json({
    overall: hasMismatch ? 'MIGRATION_REQUIRED' : 'ALL_SYSTEMS_NOMINAL',
    results,
    migration_sql: hasMismatch ? `-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/jrwqwbeegqvluaftepjn/sql/new)

DROP TABLE IF EXISTS business_weeks CASCADE;
DROP TABLE IF EXISTS study_weeks CASCADE;
DROP TABLE IF EXISTS tech_progress CASCADE;
DROP TABLE IF EXISTS calendar_logs CASCADE;
DROP FUNCTION IF EXISTS update_calendar_log CASCADE;

CREATE TABLE business_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start_date DATE UNIQUE,
  bottles_sold INTEGER DEFAULT 0,
  creatives_count INTEGER DEFAULT 0,
  landing_page_test BOOLEAN DEFAULT FALSE,
  insights_count INTEGER DEFAULT 0,
  system_improvement BOOLEAN DEFAULT FALSE,
  is_success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE study_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER CHECK (week_number BETWEEN 1 AND 4),
  month_name TEXT DEFAULT 'May',
  tasks JSONB DEFAULT '[]',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month_name, week_number)
);

CREATE TABLE tech_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id INTEGER,
  video_id TEXT UNIQUE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_certification BOOLEAN DEFAULT FALSE,
  next_unlocked BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE calendar_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_date DATE UNIQUE,
  business_score INTEGER DEFAULT 0,
  study_score INTEGER DEFAULT 0,
  tech_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE business_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_bw" ON business_weeks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_sw" ON study_weeks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tp" ON tech_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_cl" ON calendar_logs FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_calendar_log(
  p_date DATE,
  p_business_score INTEGER DEFAULT NULL,
  p_study_score INTEGER DEFAULT NULL,
  p_tech_score INTEGER DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO calendar_logs (log_date, business_score, study_score, tech_score)
  VALUES (p_date, COALESCE(p_business_score, 0), COALESCE(p_study_score, 0), COALESCE(p_tech_score, 0))
  ON CONFLICT (log_date) DO UPDATE SET
    business_score = COALESCE(p_business_score, calendar_logs.business_score),
    study_score = COALESCE(p_study_score, calendar_logs.study_score),
    tech_score = COALESCE(p_tech_score, calendar_logs.tech_score);
END;
$$ LANGUAGE plpgsql;` : null
  });
}
