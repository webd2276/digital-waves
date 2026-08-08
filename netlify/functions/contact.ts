import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, company, projectType, message } = data;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, and message are required.',
        }),
      };
    }

    // Generate ticket reference ID
    const ticketId = `DW-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = {
      success: true,
      message: 'Inquiry received successfully via Digital Waves Netlify Function',
      ticketId,
      timestamp: new Date().toISOString(),
      summary: {
        clientName: name,
        clientEmail: email,
        company: company || 'N/A',
        projectType: projectType || 'General Inquiry',
        messageLength: message.length,
      },
    };

    console.log(`[Netlify Function - Contact] Received inquiry #${ticketId} from ${name} (${email})`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error('[Netlify Function - Contact Error]:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to process contact request.',
        details: error.message,
      }),
    };
  }
};
