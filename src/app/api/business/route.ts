import { NextResponse } from 'next/server';
import { getBusinessWeek, saveBusinessWeek, getAllBusinessWeeks } from '@/lib/services/businessService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const monday = searchParams.get('monday');

  try {
    if (monday) {
      const week = await getBusinessWeek(monday);
      return NextResponse.json(week);
    }
    const all = await getAllBusinessWeeks();
    return NextResponse.json(all);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const week = await saveBusinessWeek(data);
    return NextResponse.json(week);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
