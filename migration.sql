-- FlowMe Sales Upgrade Migration
-- Run this in the Supabase SQL Editor

-- 1. Business Weekly Tracker
CREATE TABLE IF NOT EXISTS business_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start_date DATE UNIQUE, -- Use the Monday of the week
  bottles_sold INTEGER DEFAULT 0,
  creatives_count INTEGER DEFAULT 0, -- 0 to 3
  landing_page_test BOOLEAN DEFAULT FALSE,
  insights_count INTEGER DEFAULT 0, -- 0 to 3
  system_improvement BOOLEAN DEFAULT FALSE,
  is_success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Study Weekly System
CREATE TABLE IF NOT EXISTS study_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER CHECK (week_number BETWEEN 1 AND 4),
  month_name TEXT DEFAULT 'May',
  tasks JSONB DEFAULT '[]', -- List of { id: string, text: string, completed: boolean }
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month_name, week_number)
);

-- 3. Tech LMS Progress
CREATE TABLE IF NOT EXISTS tech_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id INTEGER,
  video_id TEXT UNIQUE, -- YouTube ID
  is_completed BOOLEAN DEFAULT FALSE,
  is_certification BOOLEAN DEFAULT FALSE,
  next_unlocked BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Calendar Logs (Aggregated Scores)
CREATE TABLE IF NOT EXISTS calendar_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_date DATE UNIQUE,
  business_score INTEGER DEFAULT 0,
  study_score INTEGER DEFAULT 0,
  tech_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Optional but recommended)
-- ALTER TABLE business_weeks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE study_weeks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tech_progress ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function for Atomic Calendar Updates
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
$$ LANGUAGE plpgsql;
