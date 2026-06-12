export interface GroundingChunk {
    text?: string;
    source?: {
        title?: string;
        uri?: string;
    };
    maps?: {
        title?: string;
        uri?: string;
    };
}

export interface AIResponse {
    text: string;
    groundingChunks: GroundingChunk[];
}
