
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getHealthInsights = async (healthData: any) => {
  try {
    const prompt = `
      As a health and wellness assistant, analyze the following health data and provide 3 actionable insights:
      ${JSON.stringify(healthData, null, 2)}
      
      Structure your response as a JSON array of strings. Keep insights concise and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return ["Stay hydrated throughout the day!", "Try to get at least 7 hours of sleep.", "A short walk after dinner can aid digestion."];
  }
};
