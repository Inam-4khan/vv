import { GoogleGenAI } from '@google/genai';

// Rate limiting placeholder comment:
// TODO: Implement rate limiting (e.g. using @upstash/ratelimit or Redis) to prevent API abuse

interface ServerlessRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
}

interface ServerlessResponse {
  status(statusCode: number): ServerlessResponse;
  json(body: any): ServerlessResponse;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // Invalid JSON string body
      }
    }

    const { prompt, model } = body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and cannot be empty' });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt exceeds maximum allowed length of 2000 characters' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const selectedModel = model || 'gemini-3.6-flash';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
    });

    const text = response.text ?? '';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Error generating content with Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate content via Gemini API',
    });
  }
}
