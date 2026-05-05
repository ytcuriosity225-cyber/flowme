import { NextResponse } from 'next/server';
import { getStudyWeek, saveStudyWeek, getAllStudyWeeks } from '@/lib/services/studyService';

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const week = await saveStudyWeek(data);
    return NextResponse.json(week);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
