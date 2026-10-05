import { GoogleGenAI } from '@google/genai';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method Not Allowed. Use POST.' }, 405);
  }

  try {
    const { prompt, projectScope } = await req.json().catch(() => ({}));

    // Credentials are injected by Netlify AI Gateway (GEMINI_API_KEY / GOOGLE_GEMINI_BASE_URL).
    if (!process.env.GEMINI_API_KEY) {
      return json({
        success: true,
        fallback: true,
        message: 'AI Gateway credentials are not available. Returning AI recommendation template.',
        aiAnalysis: `Based on your request "${prompt || projectScope || 'Digital Agency Project'}", Digital Waves recommends a modern stack with React, Tailwind CSS, automated AI agents, and optimized cloud hosting.`,
      });
    }

    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the chief AI technology strategist at Digital Waves Agency. Provide a brief, professional 3-sentence technical recommendation for the following client project: ${prompt || projectScope}`,
    });

    return json({
      success: true,
      aiAnalysis: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return json(
      {
        success: false,
        error: 'AI analysis failed.',
        details: error.message,
      },
      500,
    );
  }
};
