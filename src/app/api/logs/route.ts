import { NextResponse } from 'next/server';
import { createOrUpdateLog, getAllLogs } from '@/lib/services/logService';

export async function GET() {
  try {
    const logs = await getAllLogs();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { date, sales, tasks } = await request.json();
    if (!date || typeof sales !== 'number' || !tasks) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const log = await createOrUpdateLog({ date, sales, tasks });
    return NextResponse.json(log);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
