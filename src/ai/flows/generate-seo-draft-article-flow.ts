'use server';
/**
 * @fileOverview Optimized Genkit flow for generating SEO-optimized articles and intelligence in a single pass.
 * Surfaces detailed error messages to the client.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoDraftArticleInputSchema = z.object({
  topic: z.string().describe('Main subject.'),
  keywords: z.array(z.string()).describe('Target SEO keywords.'),
  audienceInsights: z.string().optional().describe('Description of the target audience.'),
  uniqueInsights: z.string().optional().describe('Specific data points, unique facts, or personal expertise to include.'),
  coreObjective: z.string().optional().describe('The primary goal or takeaway for the reader.'),
  outputFormat: z.enum(['article', 'outline']),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  targetWordCount: z.number().optional(),
  geoOptimization: z.string().optional().describe('Focus for AI Search (e.g. SearchGPT).'),
  tone: z.string().optional(),
});
export type GenerateSeoDraftArticleInput = z.infer<typeof GenerateSeoDraftArticleInputSchema>;

const GenerateSeoDraftArticleOutputSchema = z.object({
  content: z.string().describe('The generated article or outline.'),
  format: z.enum(['article', 'outline']),
  seoAnalysis: z.object({
    overallAssessment: z.string(),
    suggestions: z.object({
      eEAT: z.array(z.string()),
      gEO: z.array(z.string()),
      readability: z.array(z.string()),
      keywordDensity: z.array(z.string()),
      links: z.array(z.string()),
    }),
  }).describe('Immediate SEO and G.E.O intelligence for the generated content.'),
});
export type GenerateSeoDraftArticleOutput = z.infer<typeof GenerateSeoDraftArticleOutputSchema>;

const InternalPromptInputSchema = GenerateSeoDraftArticleInputSchema.extend({
  isArticle: z.boolean(),
  isOutline: z.boolean(),
});

export async function generateSeoDraftArticle(input: GenerateSeoDraftArticleInput): Promise<{ data?: GenerateSeoDraftArticleOutput; error?: string }> {
  try {
    const result = await generateSeoDraftArticleFlow(input);
    return { data: result };
  } catch (err: any) {
    console.error('Flow execution error:', err);
    return { error: err.message || 'An unexpected error occurred during content generation.' };
  }
}

const articlePrompt = ai.definePrompt({
  name: 'generateSeoDraftArticlePrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: GenerateSeoDraftArticleOutputSchema},
  config: { maxOutputTokens: 4096, temperature: 0.7 },
  prompt: `Act as a professional SEO/G.E.O Content Engineer. 
Goal: Generate high-quality content AND SEO intelligence in ONE PASS.

STRICT CONSTRAINT ON ORIGINALITY: 
- DO NOT start with generic tropes like "In a world...", "In today's fast-paced environment...", or "At its heart...".
- Use the provided Unique Insights/Data to lead the article with a definitive, fresh perspective.

INPUT:
Topic: {{{topic}}}
Keywords: {{#each keywords}}"{{this}}" {{/each}}
{{#if companyName}}Brand: {{{companyName}}} ({{{companyDescription}}}){{/if}}
Target Audience: {{{audienceInsights}}}
Unique Insights/Data: {{{uniqueInsights}}}
Core Objective: {{{coreObjective}}}
Tone: {{{tone}}}
Target length: {{#if targetWordCount}}{{{targetWordCount}}}{{else}}1000{{/if}} words.

STRICT CONSTRAINTS:
1. WORD COUNT: The generated {{outputFormat}} MUST be as close as possible to {{{targetWordCount}}} words. Expand on examples and data if target is high.
2. FORMAT: Proper Markdown. Use TWO newlines between paragraphs.
3. INTELLIGENCE: Provide actionable SEO insights in the seoAnalysis field.
4. E.E.A.T: Prioritize the Unique Insights/Data to build authority. Ensure the content is "citeable" for AI engines.

{{#if isArticle}}
ARTICLE STRUCTURE:
- H1 Title (# Title)
- Hook-driven Intro (Using specific data/insights)
- Multiple H2/H3 sections
- Natural keyword integration
- Definitive conclusion
{{/if}}

{{#if isOutline}}
OUTLINE STRUCTURE:
- H1 Title
- Exhaustive section headings (H2/H3)
- Detailed bullet points for each section to reach the desired word count scope
{{/if}}

Return strictly valid JSON.`,
});

const generateSeoDraftArticleFlow = ai.defineFlow(
  {
    name: 'generateSeoDraftArticleFlow',
    inputSchema: GenerateSeoDraftArticleInputSchema,
    outputSchema: GenerateSeoDraftArticleOutputSchema,
  },
  async (input) => {
    const promptInput = {
      ...input,
      isArticle: input.outputFormat === 'article',
      isOutline: input.outputFormat === 'outline',
    };

    try {
      const {output} = await articlePrompt(promptInput);
      return output!;
    } catch (error) {
      console.warn('Gemini 2.0 failed, falling back to Gemini 2.5:', error);
      const {output} = await articlePrompt(promptInput, {
        model: 'googleai/gemini-2.5-flash',
      });
      return output!;
    }
  }
);
