import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  try {
    const { prompt, projectScope } = JSON.parse(event.body || '{}');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          fallback: true,
          message: 'GEMINI_API_KEY environment variable is not set on Netlify. Returning AI recommendation template.',
          aiAnalysis: `Based on your request "${prompt || projectScope || 'Digital Agency Project'}", Digital Waves recommends a modern stack with React, Tailwind CSS, automated AI agents, and optimized cloud hosting.`,
        }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the chief AI technology strategist at Digital Waves Agency. Provide a brief, professional 3-sentence technical recommendation for the following client project: ${prompt || projectScope}`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        aiAnalysis: response.text,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'AI analysis failed.',
        details: error.message,
      }),
    };
  }
};
