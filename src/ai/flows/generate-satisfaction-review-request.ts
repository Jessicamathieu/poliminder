// use server'

/**
 * @fileOverview This file defines a Genkit flow to generate a satisfaction review request message and a link to Google Reviews page.
 *
 * - generateSatisfactionReviewRequest - A function that generates the satisfaction review request.
 * - GenerateSatisfactionReviewRequestInput - The input type for the generateSatisfactionReviewRequest function.
 * - GenerateSatisfactionReviewRequestOutput - The return type for the generateSatisfactionReviewRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSatisfactionReviewRequestInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  serviceName: z.string().describe('The name of the service provided.'),
  googleReviewsPageLink: z
    .string()
    .url()
    .describe('The link to the Google Reviews page.'),
});

export type GenerateSatisfactionReviewRequestInput = z.infer<
  typeof GenerateSatisfactionReviewRequestInputSchema
>;

const GenerateSatisfactionReviewRequestOutputSchema = z.object({
  message: z.string().describe('The satisfaction review request message.'),
});

export type GenerateSatisfactionReviewRequestOutput = z.infer<
  typeof GenerateSatisfactionReviewRequestOutputSchema
>;

export async function generateSatisfactionReviewRequest(
  input: GenerateSatisfactionReviewRequestInput
): Promise<GenerateSatisfactionReviewRequestOutput> {
  return generateSatisfactionReviewRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSatisfactionReviewRequestPrompt',
  input: {schema: GenerateSatisfactionReviewRequestInputSchema},
  output: {schema: GenerateSatisfactionReviewRequestOutputSchema},
  prompt: `You are a helpful assistant that crafts thank you messages and requests for customer reviews.

  Given the following information, create a personalized thank you message to the client and invite them to leave a review on our Google Reviews page.

  Client Name: {{{clientName}}}
  Service Provided: {{{serviceName}}}
  Google Reviews Page Link: {{{googleReviewsPageLink}}}
  `,
});

const generateSatisfactionReviewRequestFlow = ai.defineFlow(
  {
    name: 'generateSatisfactionReviewRequestFlow',
    inputSchema: GenerateSatisfactionReviewRequestInputSchema,
    outputSchema: GenerateSatisfactionReviewRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
