// use server'

/**
 * @fileOverview Provides intelligent scheduling recommendations based on employee availability, location, and service type.
 *
 * - getIntelligentSchedulingRecommendations - A function that provides scheduling recommendations.
 * - IntelligentSchedulingRecommendationsInput - The input type for the getIntelligentSchedulingRecommendations function.
 * - IntelligentSchedulingRecommendationsOutput - The return type for the getIntelligentSchedulingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSchedulingRecommendationsInputSchema = z.object({
  employeeAvailability: z.string().describe('The availability of the employee.'),
  location: z.string().describe('The location of the appointment.'),
  serviceType: z.string().describe('The type of service to be performed.'),
  workload: z.string().describe('The current workload of the employee.'),
  skills: z.string().describe('The skills of the employee.'),
});
export type IntelligentSchedulingRecommendationsInput = z.infer<typeof IntelligentSchedulingRecommendationsInputSchema>;

const IntelligentSchedulingRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('The scheduling recommendation.'),
  reason: z.string().describe('The reason for the recommendation.'),
});
export type IntelligentSchedulingRecommendationsOutput = z.infer<typeof IntelligentSchedulingRecommendationsOutputSchema>;

export async function getIntelligentSchedulingRecommendations(input: IntelligentSchedulingRecommendationsInput): Promise<IntelligentSchedulingRecommendationsOutput> {
  return getIntelligentSchedulingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIntelligentSchedulingRecommendationsPrompt',
  input: {schema: IntelligentSchedulingRecommendationsInputSchema},
  output: {schema: IntelligentSchedulingRecommendationsOutputSchema},
  prompt: `You are an expert scheduling assistant. Based on the employee's availability, location, service type, workload, and skills, provide a scheduling recommendation and a reason for the recommendation.

Employee Availability: {{{employeeAvailability}}}
Location: {{{location}}}
Service Type: {{{serviceType}}}
Workload: {{{workload}}}
Skills: {{{skills}}}

Recommendation:`,
});

const getIntelligentSchedulingRecommendationsFlow = ai.defineFlow(
  {
    name: 'getIntelligentSchedulingRecommendationsFlow',
    inputSchema: IntelligentSchedulingRecommendationsInputSchema,
    outputSchema: IntelligentSchedulingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
