import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeConcurJson = async (jsonString: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key in the settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Define the schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A professional summary of the SAP Concur JSON document, identifying if it is an Expense Report, Invoice, or Standard Accounting Extract.",
      },
      financialPostingInfo: {
        type: Type.OBJECT,
        properties: {
          totalAmount: { type: Type.NUMBER, description: "The total value found in the document." },
          currency: { type: Type.STRING, description: "The currency code." },
          postingDate: { type: Type.STRING, description: "The relevant posting date or transaction date." }
        },
        nullable: true,
      },
      warnings: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of potential issues, missing mandatory fields for SAP ICS, or data anomalies."
      },
      fieldExplanations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            field: { type: Type.STRING, description: "The JSON key name." },
            value: { type: Type.STRING, description: "The value of the key (converted to string)." },
            description: { type: Type.STRING, description: "An explanation of what this field means in the context of SAP Concur and SAP ICS integration." },
            importance: { type: Type.STRING, enum: ["high", "medium", "low"] }
          }
        },
        description: "Detailed explanation of 5-10 most critical fields in the JSON."
      }
    },
    required: ["summary", "warnings", "fieldExplanations"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `You are an expert in SAP Concur and SAP ICS (Integration with Concur Solutions). 
          Analyze the following JSON payload which is destined for or received from the SAP ICS connector.
          Explain the technical and functional meaning of the data. 
          Focus on identifying:
          1. The type of document (Expense Report, Cash Advance, etc.).
          2. Key financial data.
          3. Integration specific fields (e.g., batch IDs, employee IDs, cost centers).
          4. Any potential data integrity issues.
          
          Here is the JSON:
          ${jsonString.substring(0, 30000)}` // Limit input to avoid excessive token usage if massive, though Flash handles 1M.
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual analysis
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response generated from Gemini.");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};