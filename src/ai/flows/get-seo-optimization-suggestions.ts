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
  targetAudience: z.string().describe('Description of the target audience for the article.'),
  targetLocation: z.string().optional().describe('Optional: Geographic target for the article (e.g., "London, UK").'),
});
export type GetSeoOptimizationSuggestionsInput = z.infer<typeof GetSeoOptimizationSuggestionsInputSchema>;

const GetSeoOptimizationSuggestionsOutputSchema = z.object({
  overallAssessment: z.string().describe('A brief overall assessment of the article\'s current SEO status.'),
  suggestions: z.object({
    eEAT: z.array(z.string()).describe('Actionable recommendations for improving E.E.A.T. (Experience, Expertise, Authoritativeness, Trustworthiness), ensuring the content demonstrates a high level of credibility.'),
    gEO: z.array(z.string()).describe('Actionable recommendations for improving G.E.O. (Geographic optimization), including localized keywords, landmarks, or services if applicable.'),
    readability: z.array(z.string()).describe('Actionable recommendations for improving article readability, such as sentence structure, paragraph length, and use of headings.'),
    keywordDensity: z.array(z.string()).describe('Actionable recommendations for optimizing keyword density and strategic usage of target keywords throughout the article.'),
    internalLinking: z.array(z.string()).describe('Actionable recommendations for improving internal linking strategies within the article.'),
    externalLinking: z.array(z.string()).describe('Actionable recommendations for improving external linking strategies to authoritative sources.'),
    contentFreshness: z.array(z.string()).describe('Actionable recommendations for ensuring content remains fresh and up-to-date.'),
    callToAction: z.array(z.string()).describe('Actionable recommendations for optimizing the call to action within the article.'),
  }).describe('Categorized, actionable recommendations for SEO improvement.'),
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
  prompt: `You are an expert SEO content analyst, specializing in E.E.A.T. and G.E.O. principles, and a master of content optimization for search engines. Your task is to provide comprehensive, dynamic, and actionable recommendations to improve the provided article's search engine ranking.

Analyze the article content, target keywords, and audience to offer specific advice in the following categories: E.E.A.T., G.E.O., readability, keyword density, internal linking, external linking, content freshness, and call to action.

Focus on practical suggestions that a content writer can immediately implement to elevate the article's performance.

Article Content:
{{{articleContent}}}

Target Keywords: {{{targetKeywords}}}
Target Audience: {{{targetAudience}}}
{{#if targetLocation}}
Target Geographic Location: {{{targetLocation}}}
{{/if}}

Please provide an overall assessment followed by a list of actionable recommendations for each category, using the provided JSON schema.`,
});

const getSeoOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'getSeoOptimizationSuggestionsFlow',
    inputSchema: GetSeoOptimizationSuggestionsInputSchema,
    outputSchema: GetSeoOptimizationSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await getSeoOptimizationSuggestionsPrompt(input);
    return output!;
  }
);
