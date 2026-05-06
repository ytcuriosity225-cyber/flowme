import { NextResponse } from 'next/server';
import { getTechProgress, markVideoComplete, getPhaseUnlockStatus } from '@/lib/services/techService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkPhase = searchParams.get('checkPhase');

  try {
    if (checkPhase) {
      const isUnlocked = await getPhaseUnlockStatus(parseInt(checkPhase));
      return NextResponse.json({ isUnlocked });
    }
    const progress = await getTechProgress();
    return NextResponse.json(progress);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("API HIT: /api/tech POST");
  try {
    const data = await request.json();
    console.log("BODY:", data);
    const { phaseId, videoId, isCertification } = data;
    const progress = await markVideoComplete(phaseId, videoId, isCertification);
    return NextResponse.json(progress);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
