'use server';
/**
 * @fileOverview A Genkit flow for checking plagiarism and content originality.
 * Surfaces detailed error messages to the client.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckPlagiarismInputSchema = z.object({
  articleContent: z.string().describe('The content to analyze for originality and plagiarism risk.'),
});
export type CheckPlagiarismInput = z.infer<typeof CheckPlagiarismInputSchema>;

const CheckPlagiarismOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe('A score from 0-100 representing the risk of the content being flagged as non-original or plagiarized.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The overall risk category.'),
  analysis: z.string().describe('A brief textual analysis of the content originality.'),
  findings: z.array(z.object({
    segment: z.string().describe('The specific part of the text that poses a risk.'),
    reason: z.string().describe('Why this segment is flagged (e.g., generic phrasing, common AI pattern).'),
    suggestion: z.string().describe('How to rewrite this for better originality.'),
  })).describe('Specific segments flagged for improvement.'),
});
export type CheckPlagiarismOutput = z.infer<typeof CheckPlagiarismOutputSchema>;

export async function checkPlagiarism(input: CheckPlagiarismInput): Promise<{ data?: CheckPlagiarismOutput; error?: string }> {
  try {
    const result = await checkPlagiarismFlow(input);
    return { data: result };
  } catch (err: any) {
    console.error('Flow execution error:', err);
    return { error: err.message || 'An unexpected error occurred during originality check.' };
  }
}

const plagiarismPrompt = ai.definePrompt({
  name: 'checkPlagiarismPrompt',
  input: { schema: CheckPlagiarismInputSchema },
  output: { schema: CheckPlagiarismOutputSchema },
  prompt: `You are an expert content editor and originality analyst. Your task is to evaluate the provided article content for plagiarism risk and "AI-commonness". 

Analyze the text for:
1. High-risk segments that appear generic or follow common internet templates.
2. Content that lacks specific unique insights or data (E.E.A.T gaps).
3. Repetitive linguistic patterns typical of standard LLM outputs.

Article Content:
{{{articleContent}}}

Provide a detailed originality report including a risk score (0-100, where 100 is highly unoriginal), a risk level, and specific actionable findings.`,
});

const checkPlagiarismFlow = ai.defineFlow(
  {
    name: 'checkPlagiarismFlow',
    inputSchema: CheckPlagiarismInputSchema,
    outputSchema: CheckPlagiarismOutputSchema,
  },
  async (input) => {
    try {
      // Primary attempt using Gemini 2.0 Flash
      const { output } = await plagiarismPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
      });
      return output!;
    } catch (error) {
      console.warn('Originality check failed, retrying with fallback:', error);
      // Fallback attempt using Gemini 2.5 Flash
      const { output } = await plagiarismPrompt(input, {
        model: 'googleai/gemini-2.5-flash',
      });
      return output!;
    }
  }
);
