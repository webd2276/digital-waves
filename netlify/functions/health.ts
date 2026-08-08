import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'healthy',
      service: 'Digital Waves Agency Backend',
      runtime: 'Netlify Functions (Node.js)',
      timestamp: new Date().toISOString(),
      contactEmail: 'digitalwaves284@gmail.com',
      version: '1.0.0',
    }),
  };
};
