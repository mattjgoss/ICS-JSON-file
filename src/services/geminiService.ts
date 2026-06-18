import { AnalysisResult } from '../types';

/**
 * Calls the server-side Netlify function to analyse the SAP Concur JSON.
 * The Gemini API key is held securely on the server — this function never
 * touches it directly.
 */
export const analyzeConcurJson = async (jsonString: string): Promise<AnalysisResult> => {
  const response = await fetch('api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonString }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return response.json() as Promise<AnalysisResult>;
};
