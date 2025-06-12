//Customer Service Chatbot Flow
'use server';

/**
 * @fileOverview Customer service chatbot flow to answer FAQs, schedule appointments, and provide basic support.
 *
 * - customerServiceChatbot - A function that handles the customer service chatbot interaction.
 * - CustomerServiceChatbotInput - The input type for the customerServiceChatbot function.
 * - CustomerServiceChatbotOutput - The return type for the customerServiceChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerServiceChatbotInputSchema = z.object({
  message: z.string().describe('The message from the user.'),
});
export type CustomerServiceChatbotInput = z.infer<typeof CustomerServiceChatbotInputSchema>;

const CustomerServiceChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});
export type CustomerServiceChatbotOutput = z.infer<typeof CustomerServiceChatbotOutputSchema>;

export async function customerServiceChatbot(input: CustomerServiceChatbotInput): Promise<CustomerServiceChatbotOutput> {
  return customerServiceChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerServiceChatbotPrompt',
  input: {schema: CustomerServiceChatbotInputSchema},
  output: {schema: CustomerServiceChatbotOutputSchema},
  prompt: `You are a customer service chatbot for PoliMinder. Your goal is to answer frequently asked questions, schedule appointments, and provide basic support.

  Here are some guidelines:
  - Be friendly and helpful.
  - If you cannot answer a question, offer to connect the user with a human representative.
  - When scheduling appointments, ask for the user's preferred date and time, and confirm the appointment details.

  User message: {{{message}}}
  `,
});

const customerServiceChatbotFlow = ai.defineFlow(
  {
    name: 'customerServiceChatbotFlow',
    inputSchema: CustomerServiceChatbotInputSchema,
    outputSchema: CustomerServiceChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
