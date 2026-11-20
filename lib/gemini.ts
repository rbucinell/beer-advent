import { GoogleGenAI, GenerateContentConfig } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAI(contents: string, config: GenerateContentConfig = {}) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash", // use whatever ID you've verified
    contents,
    config: { ...config },
  });
  return response.text;
}