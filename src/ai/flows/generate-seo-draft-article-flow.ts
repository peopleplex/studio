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
    z.string().describe('Information about the target audience, their interests, and what they search for.'),
  outputFormat:
    z.enum(['article', 'outline']).describe("The desired output format: 'article' for a full draft, 'outline' for a structured outline."),
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

export async function generateSeoDraftArticle(
  input: GenerateSeoDraftArticleInput
): Promise<GenerateSeoDraftArticleOutput> {
  return generateSeoDraftArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoDraftArticlePrompt',
  input: {schema: GenerateSeoDraftArticleInputSchema},
  output: {schema: GenerateSeoDraftArticleOutputSchema},
  prompt: `You are a professional AI content writer specializing in SEO, E.E.A.T (Expertise, Authoritativeness, Trustworthiness), and G.E.O. (Geographic Optimization, if applicable) principles. Your goal is to generate high-quality content that ranks well on search engines.

Based on the following information, please generate a {{outputFormat}} that is SEO-optimized and incorporates the provided keywords naturally. Ensure the content is structured for readability and engages the target audience.

Topic: {{{topic}}}
Target Keywords: {{#each keywords}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
Audience Insights: {{{audienceInsights}}}

{{#if (eq outputFormat "article")}}
Generate a full, detailed article following these guidelines:
- Include a compelling title.
- Start with an engaging introduction that hooks the reader and clearly states what the article will cover.
- Break down the article into logical sections with clear headings and subheadings (H1, H2, H3).
- Integrate the target keywords naturally throughout the content, ensuring a good keyword density without keyword stuffing.
- Provide valuable, accurate, and expert-level information to demonstrate E.E.A.T.
- Ensure the tone and style resonate with the target audience.
- Conclude with a strong summary and a clear call to action (if appropriate).
- Aim for a comprehensive length, typically over 1000 words if possible, to cover the topic in depth.
- Use markdown formatting for headings and lists.
{{else if (eq outputFormat "outline")}}
Generate a detailed outline for an article following these guidelines:
- Include a proposed title for the article.
- Structure the outline with clear main headings (H1) and subheadings (H2, H3) that logically flow through the topic.
- For each section, briefly describe the key points and information to be covered, and suggest where target keywords can be naturally integrated.
- The outline should demonstrate how E.E.A.T. and G.E.O. principles will be addressed.
- Use markdown formatting for headings and lists.
{{/if}}
`,
});

const generateSeoDraftArticleFlow = ai.defineFlow(
  {
    name: 'generateSeoDraftArticleFlow',
    inputSchema: GenerateSeoDraftArticleInputSchema,
    outputSchema: GenerateSeoDraftArticleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
