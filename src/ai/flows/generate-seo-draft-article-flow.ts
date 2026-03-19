
'use server';
/**
 * @fileOverview A Genkit flow for generating SEO-optimized draft articles or outlines.
 *
 * - generateSeoDraftArticle - A function that handles the generation of SEO-optimized content.
 * - GenerateSeoDraftArticleInput - The input type for the generateSeoDraftArticle function.
 * - GenerateSeoDraftArticleOutput - The return type for the generateSeoDraftArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoDraftArticleInputSchema = z.object({
  topic: z.string().describe('The main subject or theme of the article.'),
  keywords:
    z.array(z.string()).describe('A list of target keywords to be incorporated into the article for SEO purposes.'),
  audienceInsights:
    z.string().optional().describe('Optional: Information about the target audience. If not provided, deduce it from the topic.'),
  outputFormat:
    z.enum(['article', 'outline']).describe("The desired output format: 'article' for a full draft, 'outline' for a structured outline."),
  companyName: z.string().optional().describe('The name of the company or brand the content is for.'),
  companyDescription: z.string().optional().describe('Overview of the company to establish E.E.A.T.'),
  targetWordCount: z.number().optional().describe('The target length of the article in words.'),
  geoOptimization: z.string().optional().describe('Focus for Generative Engine Optimization (e.g., SearchGPT, Google Overview).'),
  tone: z.string().optional().describe('The desired tone of voice (e.g., Professional, Conversational).'),
});
export type GenerateSeoDraftArticleInput = z.infer<
  typeof GenerateSeoDraftArticleInputSchema
>;

const GenerateSeoDraftArticleOutputSchema = z.object({
  content: z.string().describe('The generated SEO-optimized article draft or outline.'),
  format:
    z.enum(['article', 'outline']).describe('The format of the generated content (article or outline).'),
});
export type GenerateSeoDraftArticleOutput = z.infer<
  typeof GenerateSeoDraftArticleOutputSchema
>;

// Internal schema for the prompt that includes pre-calculated flags
const InternalPromptInputSchema = GenerateSeoDraftArticleInputSchema.extend({
  isArticle: z.boolean(),
  isOutline: z.boolean(),
});

export async function generateSeoDraftArticle(
  input: GenerateSeoDraftArticleInput
): Promise<GenerateSeoDraftArticleOutput> {
  return generateSeoDraftArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoDraftArticlePrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: GenerateSeoDraftArticleOutputSchema},
  config: {
    maxOutputTokens: 4096,
    temperature: 0.7,
  },
  prompt: `You are a professional AI content writer specializing in SEO, E.E.A.T (Expertise, Authoritativeness, Trustworthiness), and G.E.O (Generative Engine Optimization) principles. Your goal is to generate high-quality content that ranks well on traditional search engines and is optimized for AI-driven search (e.g., SearchGPT, Google SGE, Perplexity).

CRITICAL INSTRUCTION: You MUST complete the entire article or outline. Do NOT stop mid-sentence. Ensure the content flows logically to a definitive conclusion or summary.

IMPORTANT: Use proper Markdown formatting. Ensure there are AT LEAST TWO newlines between every header, paragraph, and list item to ensure proper structure.

Based on the following information, please generate a {{outputFormat}} that is SEO-optimized and incorporates the provided keywords naturally.

Topic: {{{topic}}}
{{#if tone}}Tone of Voice: {{{tone}}}{{/if}}
{{#if companyName}}Company Name: {{{companyName}}}{{/if}}
{{#if companyDescription}}Company Description: {{{companyDescription}}}{{/if}}
Target Keywords: {{#each keywords}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
{{#if geoOptimization}}G.E.O Focus (AI Search Optimization): {{{geoOptimization}}}{{/if}}
{{#if targetWordCount}}Desired Word Count: {{{targetWordCount}}} words{{/if}}

{{#if audienceInsights}}
Audience Insights: {{{audienceInsights}}}
{{else}}
Note: No specific audience provided. Please identify and target the most relevant professional or consumer audience for this topic.
{{/if}}

For G.E.O (Generative Engine Optimization):
- Structure content to be easily parsed by LLMs.
- Provide clear, direct answers to common questions within the text.
- Use structured data formatting (like tables or clear lists) where appropriate.
- Ensure the tone is authoritative and helpful.

{{#if isArticle}}
Generate a full, detailed article following these guidelines:
- Include a compelling title as an H1 (# Title).
- Start with an engaging introduction that hooks the reader and summarizes the value.
- Break down the article into logical sections with clear headings (H2, H3).
- Integrate keywords naturally.
{{#if companyName}}- Mention {{{companyName}}} strategically to build brand authority.{{/if}}
- Provide expert-level information to demonstrate E.E.A.T.
{{#if targetWordCount}}- Aim for a length close to {{{targetWordCount}}} words.{{else}}- Aim for a comprehensive length (1000+ words).{{/if}}
- Ensure the overall tone is strictly {{{tone}}}.
- ALWAYS end with a clear conclusion section.
- Use markdown formatting.
{{/if}}

{{#if isOutline}}
Generate a detailed outline for an article:
- Include a proposed title as an H1 (# Title).
- Structure with clear headings (H2, H3) that logically flow.
- Briefly describe key points for each section and where to integrate G.E.O strategies.
{{#if companyName}}- Indicate strategic placements for company mentions.{{/if}}
- Reflect the {{{tone}}} tone in the suggested content points.
- Use markdown formatting.
{{/if}}

Please provide the final output in the required JSON format, with the article prose or outline structure in the 'content' field.`,
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
      const {output} = await prompt(promptInput);
      return output!;
    } catch (error: any) {
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        const {output} = await prompt(promptInput, { model: 'openai/grok-beta' });
        return output!;
      }
      throw error;
    }
  }
);
