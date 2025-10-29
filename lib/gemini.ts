import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});


export async function askAI( contents:string ){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents
    });
    console.log( response.text );
    return( response.text );
}