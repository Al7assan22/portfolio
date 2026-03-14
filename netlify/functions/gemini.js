// netlify/functions/openai.js
exports.handler = async (event) => {
  // السماح فقط لطلبات POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  const API_KEY = process.env.OPENAI_API_KEY; // خلي المفتاح بتاعك في إعدادات Netlify

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Configuration Error: API Key missing.' })
    };
  }

  try {
    const body = JSON.parse(event.body); 
    // body لازم يكون بالشكل: { "prompt": "نصك هنا" }

    const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ممكن تغيره لـ gpt-4 لو تحب
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: body.prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // للسماح للمتصفح بالوصول
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to OpenAI', details: err.message })
    };
  }
};
