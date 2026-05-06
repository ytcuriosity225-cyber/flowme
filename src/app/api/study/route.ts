import { NextResponse } from 'next/server';
import { getStudyWeek, saveStudyWeek, getAllStudyWeeks } from '@/lib/services/studyService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekNumber = searchParams.get('week');
  const month = searchParams.get('month') || 'May';

  try {
    if (weekNumber) {
      const week = await getStudyWeek(parseInt(weekNumber), month);
      return NextResponse.json(week);
    }
    const all = await getAllStudyWeeks(month);
    return NextResponse.json(all);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("API HIT: /api/study POST");
  try {
    const data = await request.json();
    console.log("BODY:", data);
    const week = await saveStudyWeek(data);
    return NextResponse.json(week);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
