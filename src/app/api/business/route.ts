import { NextResponse } from 'next/server';
import { getBusinessWeek, saveBusinessWeek, getAllBusinessWeeks } from '@/lib/services/businessService';

export const dynamic = 'force-dynamic';

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Business API GET Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("API HIT: /api/business POST");
  try {
    const data = await request.json();
    console.log("BODY:", data);
    const week = await saveBusinessWeek(data);
    return NextResponse.json(week);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Business API POST Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
