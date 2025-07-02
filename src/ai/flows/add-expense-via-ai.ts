'use server';
/**
 * @fileOverview Flow for adding expenses via AI using natural language.
 *
 * - addExpenseViaAI - A function that processes natural language input to add an expense.
 * - AddExpenseViaAIInput - The input type for the addExpenseViaAI function.
 * - AddExpenseViaAIOutput - The return type for the addExpenseViaAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddExpenseViaAIInputSchema = z.object({
  expenseText: z
    .string()
    .describe("Natural language description of the expense (e.g., 'Add gas expense 80$ at Shell')."),
});
export type AddExpenseViaAIInput = z.infer<typeof AddExpenseViaAIInputSchema>;

const AddExpenseViaAIOutputSchema = z.object({
  success: z.boolean().describe('Whether the expense was successfully processed.'),
  message: z.string().describe('A message indicating the result of the expense processing.'),
  expenseDetails: z
    .object({
      category: z.string().optional().describe('The category of the expense.'),
      amount: z.number().optional().describe('The amount of the expense.'),
      vendor: z.string().optional().describe('The vendor of the expense.'),
      date: z.string().optional().describe('The date of the expense (YYYY-MM-DD).'),
    })
    .optional()
    .describe('Extracted details of the expense.'),
});
export type AddExpenseViaAIOutput = z.infer<typeof AddExpenseViaAIOutputSchema>;

export async function addExpenseViaAI(input: AddExpenseViaAIInput): Promise<AddExpenseViaAIOutput> {
  return addExpenseViaAIFlow(input);
}

const expenseDetailsSchema = z.object({
  category: z.string().describe('The category of the expense.'),
  amount: z.number().describe('The amount of the expense.'),
  vendor: z.string().describe('The vendor of the expense.'),
  date: z.string().describe('The date of the expense (YYYY-MM-DD).'),
});

const extractExpenseDetails = ai.defineTool({
  name: 'extractExpenseDetails',
  description: 'Extracts expense details from natural language text.',
  inputSchema: z.object({
    text: z.string().describe('The natural language text describing the expense.'),
  }),
  outputSchema: expenseDetailsSchema,
},
async (input) => {
  // Mock implementation, replace with actual logic to extract expense details.
  // This is where you would use an LLM or other NLP techniques to parse the input text.
  // and extract the expense details.
  console.log('Tool received input:', input.text);
  return {
    category: 'Uncategorized',
    amount: 0,
    vendor: 'Unknown',
    date: new Date().toISOString().slice(0, 10),
  };
});


const addExpenseViaAIPrompt = ai.definePrompt({
  name: 'addExpenseViaAIPrompt',
  tools: [extractExpenseDetails],
  input: {schema: AddExpenseViaAIInputSchema},
  output: {schema: AddExpenseViaAIOutputSchema},
  prompt: `You are an AI assistant that helps users add expenses. The user will provide a description of the expense in natural language. Use the extractExpenseDetails tool to extract structured expense details from the user's input.  If the expense details seem invalid based on the user's input, return an error. Always respond in the language of the user input. Do not ask for clarification.  If you cannot determine any expense details, return success as false.

User input: {{{expenseText}}}`, 
});

const addExpenseViaAIFlow = ai.defineFlow(
  {
    name: 'addExpenseViaAIFlow',
    inputSchema: AddExpenseViaAIInputSchema,
    outputSchema: AddExpenseViaAIOutputSchema,
  },
  async input => {
    const {output} = await addExpenseViaAIPrompt(input);
    return output!;
  }
);

