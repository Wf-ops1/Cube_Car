/// <reference types="vite/client" />
export const APP_CONFIG = {
    name: 'Cube Car',
    version: '1.0.0',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    googleAiKey: import.meta.env.VITE_GOOGLE_AI_KEY,
    environment: import.meta.env.MODE || 'development'
} as const;
