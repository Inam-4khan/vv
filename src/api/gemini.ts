export interface GeminiRequest {
  prompt: string;
  model?: string;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

export class GeminiError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'GeminiError';
    this.statusCode = statusCode;
  }
}

/**
 * Client-side helper function to generate content via the serverless /api/gemini endpoint.
 */
export async function generateGeminiContent(request: GeminiRequest): Promise<GeminiResponse> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new GeminiError(
        data.error || `Server returned error status ${response.status}`,
        response.status
      );
    }

    if (data.error) {
      throw new GeminiError(data.error, response.status);
    }

    return data as GeminiResponse;
  } catch (error: unknown) {
    if (error instanceof GeminiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while connecting to Gemini API';
    throw new GeminiError(errorMessage);
  }
}
