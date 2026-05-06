import { NextResponse } from 'next/server';
import { getCalendarLogs } from '@/lib/services/calendarService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const logs = await getCalendarLogs(start && end ? { start, end } : undefined);
    return NextResponse.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
