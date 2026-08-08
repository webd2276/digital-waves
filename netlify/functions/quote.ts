import { Handler } from '@netlify/functions';

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

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { selectedServices = [], complexity = 'medium', timeline = 'standard' } = body;

      let basePrice = 1500;
      if (selectedServices.length > 0) {
        basePrice = selectedServices.length * 1200;
      }

      const multiplier = complexity === 'high' ? 1.5 : complexity === 'low' ? 0.8 : 1.0;
      const estimatedPrice = Math.round(basePrice * multiplier);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          estimatedPrice: `$${estimatedPrice.toLocaleString()}`,
          estimatedTimeframe: timeline === 'express' ? '1-2 Weeks' : '2-4 Weeks',
          currency: 'USD',
          breakdown: {
            servicesCount: selectedServices.length,
            complexity,
            timeline,
          },
          generatedAt: new Date().toISOString(),
        }),
      };
    } catch (err: any) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid quote request payload' }),
      };
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'active',
      endpoint: '/api/quote',
      description: 'Digital Waves Instant Quote Calculation API',
    }),
  };
};
