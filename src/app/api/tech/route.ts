import { NextResponse } from 'next/server';
import { getTechProgress, markVideoComplete, getPhaseUnlockStatus } from '@/lib/services/techService';

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { phaseId, videoId, isCertification } = await request.json();
    const progress = await markVideoComplete(phaseId, videoId, isCertification);
    return NextResponse.json(progress);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
