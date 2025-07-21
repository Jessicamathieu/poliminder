'use server';
/**
 * @fileOverview An AI flow to extract expense details from a receipt image.
 * 
 * - extractExpense - A function that handles the expense extraction process.
 * - ExtractExpenseInput - The input type for the extractExpense function.
 * - ExtractExpenseOutput - The return type for the extractExpense function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ExtractExpenseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractExpenseInput = z.infer<typeof ExtractExpenseInputSchema>;

const ExtractExpenseOutputSchema = z.object({
  vendor: z.string().describe('The name of the vendor or store.'),
  date: z.string().describe('The date of the expense in YYYY-MM-DD format.'),
  amount: z.number().describe('The total amount of the expense.'),
  category: z.string().describe("A relevant category for the expense (e.g., 'Fournitures', 'Repas', 'Carburant', 'Matériel')."),
});
export type ExtractExpenseOutput = z.infer<typeof ExtractExpenseOutputSchema>;


const prompt = ai.definePrompt({
    name: 'extractExpensePrompt',
    input: { schema: ExtractExpenseInputSchema },
    output: { schema: ExtractExpenseOutputSchema },
    prompt: `You are an expert expense tracker. Analyze the provided receipt image and extract the vendor name, the date of the transaction, and the final total amount. Based on the vendor and items, determine the most appropriate expense category.

Analyze the following receipt:
{{media url=photoDataUri}}`,
});


const extractExpenseFlow = ai.defineFlow(
    {
        name: 'extractExpenseFlow',
        inputSchema: ExtractExpenseInputSchema,
        outputSchema: ExtractExpenseOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);


export async function extractExpense(input: ExtractExpenseInput): Promise<ExtractExpenseOutput> {
  const extractedData = await extractExpenseFlow(input);

  if (!extractedData) {
    throw new Error('AI could not extract data from the receipt.');
  }

  // Save the extracted data to Firestore
  await addDoc(collection(db, 'expenses'), {
    vendor: extractedData.vendor,
    date: Timestamp.fromDate(new Date(extractedData.date)),
    amount: extractedData.amount,
    category: extractedData.category,
    createdAt: Timestamp.now(),
    source: 'AI-Extraction'
  });

  return extractedData;
}
