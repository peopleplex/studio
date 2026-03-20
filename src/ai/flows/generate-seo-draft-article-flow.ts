'use server';
/**
 * @fileOverview Optimized Genkit flow for generating SEO-optimized articles.
 * Enforces strict word count adherence, Markdown formatting, and JSON output.
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
    // Sanitize error message to prevent huge text blocks in the UI
    const cleanError = err.message?.includes('Received:') 
      ? 'The AI failed to format the response correctly. Please try again with a slightly different prompt or shorter word count.' 
      : (err.message || 'An unexpected error occurred during content generation.');
    return { error: cleanError };
  }
}

const articlePrompt = ai.definePrompt({
  name: 'generateSeoDraftArticlePrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: GenerateSeoDraftArticleOutputSchema},
  config: { maxOutputTokens: 8192, temperature: 0.7 },
  prompt: `You are a specialized Content Engineering API. You MUST return valid JSON matching the provided schema.

TASK: Generate a high-quality, SEO-optimized {{{outputFormat}}} about "{{{topic}}}".

STRICT WORD COUNT CONSTRAINT:
- TARGET: {{{targetWordCount}}} words.
- CRITICAL: You MUST adhere as closely as possible to this word count. 
- If the target is high (e.g., 1000+ words), DO NOT use fluff or repetition. Instead, provide deeper analysis, more sub-headers (H3s), detailed examples, expanded explanations, and case studies to meet the length requirement.
- If the target is low, be concise and punchy.

STRICT FORMATTING CONSTRAINTS:
1. OUTPUT: Return ONLY valid JSON.
2. SYNTAX: Use standard MARKDOWN syntax (e.g., # Title, ## Header). 
3. NO HTML: DO NOT use HTML tags like <h1>, <p>, or <div>. Use only Markdown.
4. ANTI-PLAGIARISM: Do not use common AI intros like "In today's fast-paced world...". Start with the core value proposition.
5. INFORMATION GAIN: Ensure every section adds new, specific value.

INPUT DATA:
Topic: {{{topic}}}
Keywords: {{#each keywords}}"{{this}}" {{/each}}
{{#if companyName}}Brand: {{{companyName}}} ({{{companyDescription}}}){{/if}}
Target Audience: {{{audienceInsights}}}
Unique Insights: {{{uniqueInsights}}}
Tone: {{{tone}}}

{{#if isArticle}}
STRUCTURE: Use Markdown # for H1 Title, ## for H2, and ### for H3. Include an engaging hook, multiple detailed sections to meet the word count, and a strategic conclusion.
{{/if}}

{{#if isOutline}}
STRUCTURE: Markdown # for H1 Title, followed by extremely detailed bullet points for each section that provide enough context to write the full piece.
{{/if}}

REQUIRED JSON STRUCTURE:
{
  "content": "...",
  "format": "{{{outputFormat}}}",
  "seoAnalysis": {
    "overallAssessment": "...",
    "suggestions": { "eEAT": [], "gEO": [], "readability": [], "keywordDensity": [], "links": [] }
  }
}`,
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

    const runWithModel = async (modelName: string) => {
      const {output} = await articlePrompt(promptInput, { model: modelName as any });
      if (!output) throw new Error('Model returned empty output');
      return output;
    };

    try {
      // Primary model: Gemini 2.0 Flash
      return await runWithModel('googleai/gemini-2.0-flash');
    } catch (error) {
      console.warn('Primary model failed, falling back to Gemini 2.5 Flash:', error);
      // Fallback model: Gemini 2.5 Flash
      return await runWithModel('googleai/gemini-2.5-flash');
    }
  }
);