import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for high-speed SEO content generation.
 * Using Gemini 1.5 Flash for maximum stability and speed in production.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-1.5-flash',
});
