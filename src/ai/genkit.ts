import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openai} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    openai({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});