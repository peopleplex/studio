
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from 'genkitx-openai';

/**
 * Genkit instance configured with Google AI (Gemini 2.0 Flash) 
 * and OpenAI-compatible provider for Grok AI fallback.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
    openAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
