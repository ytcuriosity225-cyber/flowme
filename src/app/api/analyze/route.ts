import { DayLog } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBM_pbK2fEpHdtoTylckIsfF1qfthFC004';

export async function POST(request: Request) {
  try {
    const { logs, userName = 'Hadi' } = await request.json();

    if (!logs || logs.length === 0) {
      return Response.json(
        {
          critique: 'Start tracking your days to get performance insights.',
          advice: 'Complete your first day execution to unlock personalized strategies.',
        },
        { status: 200 }
      );
    }

    // Calculate metrics from logs
    const recentLogs = logs.slice(-7); // Last 7 days
    const avgScore = Math.round(
      recentLogs.reduce((sum: number, l: DayLog) => sum + (l.score || 0), 0) / recentLogs.length
    );

    const totalSales = recentLogs.reduce((sum: number, l: DayLog) => sum + (l.sales || 0), 0);
    const avgSales = Math.round(totalSales / recentLogs.length);

    // Count task completions
    const taskCounts: Record<string, number> = {};
    recentLogs.forEach((log: DayLog) => {
      Object.entries(log.tasks || {}).forEach(([key, value]) => {
        if (value) taskCounts[key] = (taskCounts[key] || 0) + 1;
      });
    });

    // Identify strengths and weaknesses
    const taskSamples = Object.entries(taskCounts).sort(([, a], [, b]) => b - a);
    const strength = taskSamples[0]?.[0] || 'execution';
    const weakness = taskSamples[taskSamples.length - 1]?.[0] || 'consistency';

    // Fetch Gemini analysis
    const prompt = `You are a performance coach for a tech founder/entrepreneur. Analyze this performance data and provide exactly 2 lines of advice:

Data Summary:
- User Name: ${userName}
- Average Score (7 days): ${avgScore}/100
- Average Daily Sales: ${avgSales}
- Strongest Area: ${strength}
- Weakest Area: ${weakness}

Provide TWO lines ONLY:
Line 1: A specific performance critique (15-20 words)
Line 2: Strategic advice for tonight/tomorrow (15-20 words)

Format your response as:
Critique: [line 1]
Advice: [line 2]`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      // Fallback analysis if API fails
      return Response.json(
        {
          critique: `Your score averages ${avgScore}/100. Focus on high-impact tasks for consistent growth.`,
          advice: `Prioritize your weakest area (${weakness}) tonight to build momentum tomorrow.`,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse response
    const critiqueMatch = content.match(/Critique:\s*(.+?)(?:\n|Advice:|$)/);
    const adviceMatch = content.match(/Advice:\s*(.+?)(?:\n|$)/);

    const critique = critiqueMatch?.[1]?.trim() || `Your score averages ${avgScore}/100. Maintain consistency in high-impact activities.`;
    const advice = adviceMatch?.[1]?.trim() || `Tonight, focus on ${weakness} to strengthen your execution foundation.`;

    return Response.json(
      {
        critique,
        advice,
        metrics: {
          avgScore,
          avgSales,
          strength,
          weakness,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analysis API error:', error);
    return Response.json(
      {
        critique: 'System analyzing your performance...',
        advice: 'Keep pushing—consistency builds excellence.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}
