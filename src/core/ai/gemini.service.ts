import { GoogleGenAI, Tool } from "@google/genai";
import { AIResponse, GroundingChunk } from "./ai.types";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        let apiKey = "";
        try {
            if (typeof process !== "undefined" && process?.env?.API_KEY) {
                apiKey = process.env.API_KEY;
            }
        } catch (e) {
            console.warn("Failed to access process.env", e);
        }

        if (apiKey) {
            ai = new GoogleGenAI({ apiKey });
        } else {
            console.warn("Gemini API Key is missing. AI features will not work.");
        }
    }
    return ai;
};

/**
 * Gemini Service (Core AI)
 * Handles AI orchestration using the Gemini Model.
 */
export const searchWithGemini = async (
    query: string,
    userLocation?: { lat: number; lng: number }
): Promise<AIResponse> => {
    try {
        const client = getAiClient();
        if (!client) {
            return {
                text: "AI service is not configured.",
                groundingChunks: []
            };
        }

        const modelId = "gemini-2.5-flash";
        const tools: Tool[] = [{ googleMaps: {} }];

        const toolConfig = userLocation
            ? {
                retrievalConfig: {
                    latLng: {
                        latitude: userLocation.lat,
                        longitude: userLocation.lng,
                    },
                },
            }
            : undefined;

        const response = await client.models.generateContent({
            model: modelId,
            contents: query,
            config: {
                tools,
                toolConfig,
                systemInstruction: `You are a helpful travel assistant for a P2P car sharing app called Cube Car. 
        Help users find locations, destinations, or plan trips. 
        If they ask for specific places to pick up cars or visit, use Google Maps to find them.
        Keep responses concise and focused on helping them rent a car for their journey.`,
            },
        });

        const text = response.text || "I couldn't generate a response. Please try again.";
        const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as unknown as GroundingChunk[];

        return {
            text,
            groundingChunks,
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            text: "Sorry, I encountered an error while searching.",
            groundingChunks: [],
        };
    }
};
