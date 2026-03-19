
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { openai } from 'genkitx-openai';

/**
 * Genkit instance configured with Google AI (Gemini 3.1 Flash Lite) 
 * and OpenAI-compatible plugin for Grok fallback.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
    openai({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    }),
  ],
  model: 'googleai/gemini-3.1-flash-lite',
});
