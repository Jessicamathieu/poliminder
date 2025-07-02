'use server';

/**
 * @fileOverview Processes AI commands to access information and perform actions.
 *
 * - processAICommand - Processes the given AI command.
 * - ProcessAICommandInput - The input type for the processAICommand function.
 * - ProcessAICommandOutput - The return type for the processAICommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessAICommandInputSchema = z.object({
  command: z.string().describe('The AI command to process.'),
});
export type ProcessAICommandInput = z.infer<typeof ProcessAICommandInputSchema>;

const ProcessAICommandOutputSchema = z.object({
  processed: z.boolean().describe('Whether the AI command was successfully processed.'),
  result: z.string().describe('The result of processing the AI command.'),
});
export type ProcessAICommandOutput = z.infer<typeof ProcessAICommandOutputSchema>;

export async function processAICommand(input: ProcessAICommandInput): Promise<ProcessAICommandOutput> {
  return processAICommandFlow(input);
}

const isValidCommand = ai.defineTool({
  name: 'isValidCommand',
  description: 'Checks if the given AI command is valid and makes sense.',
  inputSchema: z.object({
    command: z.string().describe('The AI command to validate.'),
  }),
  outputSchema: z.boolean(),
},
async (input) => {
    // TODO: Implement the logic to validate the command
    // This is a placeholder implementation - replace it with actual logic
    return input.command.length > 0; // Returns true if the command is not empty
  }
);

const processAICommandPrompt = ai.definePrompt({
  name: 'processAICommandPrompt',
  tools: [isValidCommand],
  input: {schema: ProcessAICommandInputSchema},
  output: {schema: ProcessAICommandOutputSchema},
  prompt: `You are an AI assistant that processes commands to help the user quickly access information and perform actions.

  The user has provided the following command:
  {{command}}

  First, use the isValidCommand tool to determine if the command is valid and makes sense. If the command is not valid, respond with processed: false and a message indicating that the command was not understood.

  If the command is valid, process the command and return the result.
`,
});

const processAICommandFlow = ai.defineFlow(
  {
    name: 'processAICommandFlow',
    inputSchema: ProcessAICommandInputSchema,
    outputSchema: ProcessAICommandOutputSchema,
  },
  async input => {
    const {output} = await processAICommandPrompt(input);
    return output!;
  }
);
