import { NextResponse } from 'next/server';
import { getCalendarLogs } from '@/lib/services/calendarService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const logs = await getCalendarLogs(start && end ? { start, end } : undefined);
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
