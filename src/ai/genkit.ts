import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for high-speed SEO content generation.
 * Using Gemini 1.5 Flash for maximum stability and speed in production.
 * Explicitly passing the API key to ensure it's picked up in the App Hosting environment.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
