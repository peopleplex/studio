import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for professional SEO content generation.
 * Uses Gemini 1.5 Flash as the primary model for higher stability and quota limits.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error('CRITICAL: GOOGLE_GENAI_API_KEY is not defined in the environment.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
