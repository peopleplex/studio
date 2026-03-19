import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for professional SEO content generation.
 * Using Gemini 1.5 Flash for high speed and production-grade stability.
 * The API key is sourced from environment variables mapped via apphosting.yaml.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
