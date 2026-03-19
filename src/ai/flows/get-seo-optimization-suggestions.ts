'use server';
/**
 * @fileOverview Provides AI-driven recommendations for SEO optimization.
 *
 * - getSeoOptimizationSuggestions - A function that generates SEO optimization suggestions for an article.
 * - GetSeoOptimizationSuggestionsInput - The input type for the getSeoOptimizationSuggestions function.
 * - GetSeoOptimizationSuggestionsOutput - The return type for the getSeoOptimizationSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetSeoOptimizationSuggestionsInputSchema = z.object({
  articleContent: z.string().describe('The full content of the article to be optimized.'),
  targetKeywords: z.array(z.string()).describe('A list of target keywords for the article.'),
  geoOptimization: z.string().optional().describe('Optional: Generative Engine Optimization focus (e.g. "Google SGE", "SearchGPT").'),
});
export type GetSeoOptimizationSuggestionsInput = z.infer<typeof GetSeoOptimizationSuggestionsInputSchema>;

const GetSeoOptimizationSuggestionsOutputSchema = z.object({
  overallAssessment: z.string().describe('A brief overall assessment of the article\'s current SEO and G.E.O status.'),
  suggestions: z.object({
    eEAT: z.array(z.string()).describe('Actionable recommendations for improving E.E.A.T.'),
    gEO: z.array(z.string()).describe('Actionable recommendations for Generative Engine Optimization (AI search visibility).'),
    readability: z.array(z.string()).describe('Actionable recommendations for readability.'),
    keywordDensity: z.array(z.string()).describe('Actionable recommendations for keywords.'),
    internalLinking: z.array(z.string()).describe('Actionable recommendations for internal linking.'),
    externalLinking: z.array(z.string()).describe('Actionable recommendations for external linking.'),
    contentFreshness: z.array(z.string()).describe('Actionable recommendations for content freshness.'),
    callToAction: z.array(z.string()).describe('Actionable recommendations for CTA.'),
  }).describe('Categorized recommendations.'),
});
export type GetSeoOptimizationSuggestionsOutput = z.infer<typeof GetSeoOptimizationSuggestionsOutputSchema>;

export async function getSeoOptimizationSuggestions(
  input: GetSeoOptimizationSuggestionsInput
): Promise<GetSeoOptimizationSuggestionsOutput> {
  return getSeoOptimizationSuggestionsFlow(input);
}

const getSeoOptimizationSuggestionsPrompt = ai.definePrompt({
  name: 'getSeoOptimizationSuggestionsPrompt',
  input: { schema: GetSeoOptimizationSuggestionsInputSchema },
  output: { schema: GetSeoOptimizationSuggestionsOutputSchema },
  prompt: `You are an expert SEO and G.E.O (Generative Engine Optimization) content analyst. Your task is to provide comprehensive recommendations to improve the provided article's ranking in traditional search and visibility in AI-driven generative search results.

Analyze the article content and keywords to offer specific advice. Focus on how to make the content more "findable" and "citeable" by AI models like Gemini, SearchGPT, and Perplexity.

Article Content:
{{{articleContent}}}

Target Keywords: {{{targetKeywords}}}
{{#if geoOptimization}}
Target AI Engine Optimization: {{{geoOptimization}}}
{{/if}}

Please provide an overall assessment followed by a list of actionable recommendations for each category, using the provided JSON schema. In the G.E.O category, focus on AI-search strategies like source citability, direct answer snippets, and structured formatting.`,
});

const getSeoOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'getSeoOptimizationSuggestionsFlow',
    inputSchema: GetSeoOptimizationSuggestionsInputSchema,
    outputSchema: GetSeoOptimizationSuggestionsOutputSchema,
  },
  async (input) => {
    try {
      // Primary attempt with default model (Gemini 2.0 Flash)
      const { output } = await getSeoOptimizationSuggestionsPrompt(input);
      return output!;
    } catch (error: any) {
      // Check if quota exceeded or 429 error
      const errorMsg = error.message?.toLowerCase() || '';
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('limit')) {
        console.warn('Primary analysis model quota reached. Falling back to Gemini 1.5 Flash.');
        // Fallback attempt with Gemini 1.5 Flash
        const { output } = await getSeoOptimizationSuggestionsPrompt(input, { model: 'googleai/gemini-1.5-flash' });
        return output!;
      }
      throw error;
    }
  }
);
