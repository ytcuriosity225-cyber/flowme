import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("TEST DB ROUTE HIT");
  try {
    const testData = {
      week_start_date: new Date().toISOString().split('T')[0],
      bottles_sold: 999,
      creatives_count: 3,
      landing_page_test: true,
      insights_count: 3,
      system_improvement: true,
      is_success: true
    };

    console.log("Attempting forced insert into business_weeks:", testData);

    const { data, error } = await supabaseAdmin
      .from('business_weeks')
      .upsert(testData, { onConflict: 'week_start_date' })
      .select()
      .single();

    if (error) {
      console.error("FORCED INSERT FAILED:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log("FORCED INSERT SUCCESS:", data);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error("TEST ROUTE CRASHED:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
