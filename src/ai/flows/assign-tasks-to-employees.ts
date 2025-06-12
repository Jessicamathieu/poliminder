'use server';
/**
 * @fileOverview Assigns tasks to employees based on their skills, location, and workload.
 *
 * - assignTasksToEmployees - A function that handles the task assignment process.
 * - AssignTasksToEmployeesInput - The input type for the assignTasksToEmployees function.
 * - AssignTasksToEmployeesOutput - The return type for the assignTasksToEmployees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignTasksToEmployeesInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        taskId: z.string().describe('The unique identifier for the task.'),
        description: z.string().describe('A description of the task to be completed.'),
        location: z.string().describe('The location where the task needs to be performed.'),
        requiredSkills: z.array(z.string()).describe('A list of skills required to complete the task.'),
        deadline: z.string().describe('The deadline for the task.'),
      })
    )
    .describe('A list of tasks to be assigned.'),
  employees:
    z.array(
      z.object({
        employeeId: z.string().describe('The unique identifier for the employee.'),
        name: z.string().describe('The name of the employee.'),
        location: z.string().describe('The current location of the employee.'),
        skills: z.array(z.string()).describe('A list of skills possessed by the employee.'),
        currentWorkload: z.number().describe('The current workload of the employee (e.g., number of tasks).'),
      })
    )
    .describe('A list of employees available for task assignment.'),
});
export type AssignTasksToEmployeesInput = z.infer<typeof AssignTasksToEmployeesInputSchema>;

const AssignTasksToEmployeesOutputSchema = z.object({
  assignments:
    z.array(
      z.object({
        taskId: z.string().describe('The ID of the task that was assigned'),
        employeeId: z.string().describe('The ID of the employee to whom the task was assigned.'),
        reason: z.string().describe('The reason for assigning the task to the employee.'),
      })
    )
    .describe('A list of task assignments.'),
  unassignedTasks: z.array(z.string()).describe('A list of task IDs that could not be assigned to any employee'),
});
export type AssignTasksToEmployeesOutput = z.infer<typeof AssignTasksToEmployeesOutputSchema>;

export async function assignTasksToEmployees(input: AssignTasksToEmployeesInput): Promise<AssignTasksToEmployeesOutput> {
  return assignTasksToEmployeesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignTasksToEmployeesPrompt',
  input: {schema: AssignTasksToEmployeesInputSchema},
  output: {schema: AssignTasksToEmployeesOutputSchema},
  prompt: `You are an AI assistant responsible for assigning tasks to employees based on their skills, location, and workload. Your goal is to distribute the work effectively and improve employee utilization.

Tasks:
{{#each tasks}}
  - Task ID: {{taskId}}
    Description: {{description}}
    Location: {{location}}
    Required Skills: {{#each requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    Deadline: {{deadline}}
{{/each}}

Employees:
{{#each employees}}
  - Employee ID: {{employeeId}}
    Name: {{name}}
    Location: {{location}}
    Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    Current Workload: {{currentWorkload}}
{{/each}}

Based on the tasks and employees provided, generate a list of task assignments, considering skills, location, and workload. Provide a reason for each assignment. If a task cannot be assigned, include it in the unassignedTasks array.

Output the assignments in JSON format.`,
});

const assignTasksToEmployeesFlow = ai.defineFlow(
  {
    name: 'assignTasksToEmployeesFlow',
    inputSchema: AssignTasksToEmployeesInputSchema,
    outputSchema: AssignTasksToEmployeesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
