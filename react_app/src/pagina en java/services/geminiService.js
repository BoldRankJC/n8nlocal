import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
// Note: In a real production app, be careful exposing keys on the client side.
// For Vite, use VITE_GEMINI_API_KEY in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
    console.warn('⚠️ Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const streamChatResponse = async (
    history,
    newMessage,
    onChunk
) => {
    try {
        const model = 'gemini-2.5-flash';

        // Create a chat session
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: "Eres el Asistente de Recursos Humanos (HR) de Boosted. Tu tono es profesional, empático, servicial y amable. Responde de manera concisa y clara. Ayudas con dudas sobre vacaciones, nómina, cultura organizacional y beneficios.",
            },
            history: history,
        });

        const resultStream = await chat.sendMessageStream({
            message: newMessage
        });

        let fullText = '';
        for await (const chunk of resultStream) {
            if (chunk.text) {
                fullText += chunk.text;
                onChunk(fullText);
            }
        }

        return fullText;
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        throw error;
    }
};
