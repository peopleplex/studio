'use server';
/**
 * @fileOverview Optimized Genkit flow for generating SEO-optimized articles and intelligence in a single pass.
 * Surfaces detailed error messages to the client and enforces strict word count targets.
 * Includes advanced anti-plagiarism and "AI-commonness" reduction strategies.
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
  format: z.enum(['article', 'outline']).describe('Must match the requested output format.'),
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
  config: { maxOutputTokens: 4096, temperature: 0.8 },
  prompt: `Act as a professional SEO/G.E.O Content Engineer specializing in "Information Gain" content.

STRICT ANTI-PLAGIARISM & ORIGINALITY CONSTRAINTS:
1. NO GENERIC INTROS: Do not start with phrases like "In today's digital age," "Imagine a world where," or "SEO is a vital part of..."
2. LEAD WITH DATA: Immediately start with the specific "Unique Insights" or data provided. If none are provided, invent a highly specific, realistic case study scenario.
3. BURSTINESS: Use varied sentence lengths (short, punchy sentences followed by longer, explanatory ones).
4. NO AI TROPES: Avoid "In conclusion," "Furthermore," "Additionally," and "It is important to note." Use natural transitions instead.
5. INFORMATION GAIN: Every paragraph must provide a new insight or specific detail. Do not repeat the same point in different words.

INPUT:
Topic: {{{topic}}}
Keywords: {{#each keywords}}"{{this}}" {{/each}}
{{#if companyName}}Brand: {{{companyName}}} ({{{companyDescription}}}){{/if}}
Target Audience: {{{audienceInsights}}}
Unique Insights/Data: {{{uniqueInsights}}}
Core Objective: {{{coreObjective}}}
Tone: {{{tone}}}
Target Word Count: {{{targetWordCount}}}
Requested Format: {{{outputFormat}}}

STRICT CONSTRAINTS:
1. WORD COUNT: The generated content MUST be as close as possible to {{{targetWordCount}}} words.
2. FORMAT FIELD: You MUST include the "format" field in your JSON output, and it MUST be "{{{outputFormat}}}".
3. CONTENT STYLE: Proper Markdown. Use TWO newlines between paragraphs.
4. INTELLIGENCE: Provide actionable SEO/G.E.O insights in the "seoAnalysis" object.
5. E.E.A.T: Prioritize the Unique Insights/Data to build authority.

{{#if isArticle}}
ARTICLE STRUCTURE:
- H1 Title (# Title)
- Hook Intro (Data-driven and unique)
- Multiple H2/H3 sections
- Natural, invisible keyword integration
- Definitive, actionable conclusion (avoiding "In conclusion")
{{/if}}

{{#if isOutline}}
OUTLINE STRUCTURE:
- H1 Title
- Comprehensive section headings (H2/H3)
- Detailed bullet points for each section that highlight the specific data to be used
{{/if}}

REQUIRED JSON OUTPUT STRUCTURE:
{
  "content": "...",
  "format": "{{{outputFormat}}}",
  "seoAnalysis": {
    "overallAssessment": "...",
    "suggestions": {
      "eEAT": [],
      "gEO": [],
      "readability": [],
      "keywordDensity": [],
      "links": []
    }
  }
}

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
      // Primary attempt using Gemini 2.0 Flash
      const {output} = await articlePrompt(promptInput, {
        model: 'googleai/gemini-2.0-flash',
      });
      return output!;
    } catch (error) {
      console.warn('Initial generation attempt failed, retrying with fallback:', error);
      // Fallback attempt using Gemini 2.5 Flash
      const {output} = await articlePrompt(promptInput, {
        model: 'googleai/gemini-2.5-flash',
      });
      return output!;
    }
  }
);
