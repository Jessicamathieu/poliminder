'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Textarea } from '@/components/common/textarea';
import { useToast } from '@/hooks/use-toast';
import { assignTasksToEmployees, type AssignTasksToEmployeesInput, type AssignTasksToEmployeesOutput } from '@/ai/flows/assign-tasks-to-employees';
import { UsersRound, PlusCircle, Trash2 } from 'lucide-react';

const TaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  requiredSkills: z.string().min(1, 'Skills are required (comma-separated)'), // Will be split into array
  deadline: z.string().min(1, 'Deadline is required'),
});

const EmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  skills: z.string().min(1, 'Skills are required (comma-separated)'), // Will be split into array
  currentWorkload: z.coerce.number().min(0, 'Workload must be non-negative'),
});

const FormSchema = z.object({
  tasks: z.array(TaskSchema).min(1, "At least one task is required."),
  employees: z.array(EmployeeSchema).min(1, "At least one employee is required."),
});

type FormData = z.infer<typeof FormSchema>;

export default function AutomatedTaskAssignmentFormCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssignTasksToEmployeesOutput | null>(null);
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tasks: [{ taskId: 'T001', description: '', location: '', requiredSkills: '', deadline: '' }],
      employees: [{ employeeId: 'E001', name: '', location: '', skills: '', currentWorkload: 0 }],
    },
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({ control, name: 'tasks' });
  const { fields: employeeFields, append: appendEmployee, remove: removeEmployee } = useFieldArray({ control, name: 'employees' });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const formattedData: AssignTasksToEmployeesInput = {
        tasks: data.tasks.map(task => ({ ...task, requiredSkills: task.requiredSkills.split(',').map(s => s.trim()) })),
        employees: data.employees.map(emp => ({ ...emp, skills: emp.skills.split(',').map(s => s.trim()) })),
      };
      const response = await assignTasksToEmployees(formattedData);
      setResult(response);
      toast({ title: 'Attribution terminée', description: "L'IA a attribué les tâches." });
    } catch (error) {
      console.error('Error assigning tasks:', error);
      toast({ title: 'Erreur', description: "Échec de l'attribution des tâches.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><UsersRound className="mr-2 h-6 w-6 text-accent" /> Attribution automatique des tâches</CardTitle>
        <CardDescription>Laissez l'IA attribuer les tâches selon les compétences, la localisation et la charge.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Tasks Section */}
          <div className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tâches à attribuer</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendTask({ taskId: `T00${taskFields.length + 1}`, description: '', location: '', requiredSkills: '', deadline: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une tâche
              </Button>
            </div>
            {taskFields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-md space-y-2 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><Label>ID de tâche</Label><Input {...register(`tasks.${index}.taskId`)} /></div>
                  <div><Label>Échéance</Label><Input type="date" {...register(`tasks.${index}.deadline`)} /></div>
                </div>
                <div><Label>Description</Label><Textarea {...register(`tasks.${index}.description`)} /></div>
                <div><Label>Lieu</Label><Input {...register(`tasks.${index}.location`)} /></div>
                <div><Label>Compétences requises (séparées par des virgules)</Label><Input {...register(`tasks.${index}.requiredSkills`)} /></div>
                {errors.tasks?.[index] && <p className="text-xs text-destructive">Veuillez remplir tous les champs de la tâche.</p>}
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeTask(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
             {errors.tasks && !errors.tasks.root && !Array.isArray(errors.tasks) && <p className="text-sm text-destructive">{errors.tasks.message}</p>}
          </div>

          {/* Employees Section */}
          <div className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Employés disponibles</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendEmployee({ employeeId: `E00${employeeFields.length + 1}`, name: '', location: '', skills: '', currentWorkload: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un employé
              </Button>
            </div>
            {employeeFields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-md space-y-2 relative">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><Label>ID employé</Label><Input {...register(`employees.${index}.employeeId`)} /></div>
                  <div><Label>Nom</Label><Input {...register(`employees.${index}.name`)} /></div>
                  <div><Label>Lieu</Label><Input {...register(`employees.${index}.location`)} /></div>
                  <div><Label>Charge actuelle</Label><Input type="number" {...register(`employees.${index}.currentWorkload`)} /></div>
                </div>
                <div><Label>Compétences (séparées par des virgules)</Label><Input {...register(`employees.${index}.skills`)} /></div>
                {errors.employees?.[index] && <p className="text-xs text-destructive">Veuillez remplir tous les champs de l'employé.</p>}
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeEmployee(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {errors.employees && !errors.employees.root && !Array.isArray(errors.employees) && <p className="text-sm text-destructive">{errors.employees.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {isLoading ? 'Attribution...' : 'Attribuer automatiquement'}
          </Button>
          {result && (
            <div className="w-full p-4 border rounded-md bg-muted">
              <h4 className="font-semibold mb-2">Résultats :</h4>
              {result.assignments.length > 0 && (
                <>
                  <h5 className="font-medium mt-2">Tâches attribuées :</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.assignments.map(a => <li key={`${a.taskId}-${a.employeeId}`}>Tâche {a.taskId} pour employé {a.employeeId} (Raison : {a.reason})</li>)}
                  </ul>
                </>
              )}
              {result.unassignedTasks.length > 0 && (
                 <>
                  <h5 className="font-medium mt-2 text-destructive">Tâches non attribuées :</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.unassignedTasks.map(taskId => <li key={taskId}>Tâche {taskId}</li>)}
                  </ul>
                </>
              )}
              {result.assignments.length === 0 && result.unassignedTasks.length === 0 && (
                <p className="text-sm">Aucune tâche ou employé fourni, ou aucune attribution possible.</p>
              )}
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
