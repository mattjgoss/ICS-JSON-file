import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: /\.covantage\.com\.au$/ }));

/**
 * POST /api/analyze
 * Body: { jsonString: string }
 * Returns a structured AI analysis of the SAP Concur ICS JSON payload.
 * The Gemini API key lives in the Netlify environment — never exposed to the browser.
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const { jsonString } = req.body;
    if (!jsonString || typeof jsonString !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid jsonString in request body.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description:
            'A professional summary of the SAP Concur JSON document, identifying if it is an Expense Report, Invoice, or Standard Accounting Extract.',
        },
        financialPostingInfo: {
          type: Type.OBJECT,
          properties: {
            totalAmount: { type: Type.NUMBER, description: 'The total value found in the document.' },
            currency: { type: Type.STRING, description: 'The currency code.' },
            postingDate: { type: Type.STRING, description: 'The relevant posting date or transaction date.' },
          },
          nullable: true,
        },
        warnings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'A list of potential issues, missing mandatory fields for SAP ICS, or data anomalies.',
        },
        fieldExplanations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              field: { type: Type.STRING, description: 'The JSON key name.' },
              value: { type: Type.STRING, description: 'The value of the key (converted to string).' },
              description: {
                type: Type.STRING,
                description:
                  'An explanation of what this field means in the context of SAP Concur and SAP ICS integration.',
              },
              importance: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
            },
          },
          description: 'Detailed explanation of 5-10 most critical fields in the JSON.',
        },
      },
      required: ['summary', 'warnings', 'fieldExplanations'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          text: `You are an expert in SAP Concur and SAP ICS (Integration with Concur Solutions).
          Analyse the following JSON payload which is destined for or received from the SAP ICS connector.
          Explain the technical and functional meaning of the data.
          Focus on identifying:
          1. The type of document (Expense Report, Cash Advance, etc.).
          2. Key financial data.
          3. Integration specific fields (e.g., batch IDs, employee IDs, cost centres).
          4. Any potential data integrity issues.

          Here is the JSON:
          ${jsonString.substring(0, 30000)}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.2,
      },
    });

    if (response.text) {
      return res.json(JSON.parse(response.text));
    }

    throw new Error('No response generated from Gemini.');
  } catch (e: any) {
    console.error('ICS Explainer API error:', e);
    let errorMessage = e?.message || 'Failed to analyse JSON.';
    if (errorMessage.includes('Quota exceeded') || errorMessage.includes('429')) {
      errorMessage = 'API rate limit reached. Please wait a moment and try again.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

export const handler = serverless(app);
