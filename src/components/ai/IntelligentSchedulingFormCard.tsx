'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Textarea } from '@/components/common/textarea';
import { useToast } from '@/hooks/use-toast';
import { getIntelligentSchedulingRecommendations, type IntelligentSchedulingRecommendationsInput, type IntelligentSchedulingRecommendationsOutput } from '@/ai/flows/get-intelligent-scheduling-recommendations';
import { CalendarCog } from 'lucide-react';

const FormSchema = z.object({
  employeeAvailability: z.string().min(1, 'Employee availability is required'),
  location: z.string().min(1, 'Location is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  workload: z.string().min(1, 'Workload is required'),
  skills: z.string().min(1, 'Skills are required'),
});

type FormData = z.infer<typeof FormSchema>;

export default function IntelligentSchedulingFormCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IntelligentSchedulingRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getIntelligentSchedulingRecommendations(data);
      setResult(response);
      toast({ title: 'Scheduling Recommendation Ready', description: 'AI has provided a suggestion.' });
    } catch (error) {
      console.error('Error getting scheduling recommendations:', error);
      toast({ title: 'Error', description: 'Failed to get recommendations.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><CalendarCog className="mr-2 h-6 w-6 text-accent" /> Intelligent Scheduling Recommendations</CardTitle>
        <CardDescription>Get AI-powered suggestions for optimal scheduling based on various factors.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="employeeAvailabilityIs">Employee Availability</Label>
            <Input id="employeeAvailabilityIs" {...register('employeeAvailability')} placeholder="e.g., Mon-Fri 9am-5pm, unavailable Wed afternoon" />
            {errors.employeeAvailability && <p className="text-sm text-destructive">{errors.employeeAvailability.message}</p>}
          </div>
          <div>
            <Label htmlFor="locationIs">Appointment Location</Label>
            <Input id="locationIs" {...register('location')} placeholder="e.g., Downtown Anytown, or specific address" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="serviceTypeIs">Service Type</Label>
            <Input id="serviceTypeIs" {...register('serviceType')} placeholder="e.g., Exterior Cleaning, Window Washing" />
            {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType.message}</p>}
          </div>
          <div>
            <Label htmlFor="workloadIs">Employee's Current Workload</Label>
            <Input id="workloadIs" {...register('workload')} placeholder="e.g., Light, 3 appointments today" />
            {errors.workload && <p className="text-sm text-destructive">{errors.workload.message}</p>}
          </div>
           <div>
            <Label htmlFor="skillsIs">Employee's Skills</Label>
            <Input id="skillsIs" {...register('skills')} placeholder="e.g., Gutter cleaning, Pressure washing, Ladder certified" />
            {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </Button>
          {result && (
            <div className="w-full p-4 border rounded-md bg-muted">
              <h4 className="font-semibold mb-1">Recommendation:</h4>
              <p className="text-sm mb-2">{result.recommendation}</p>
              <h4 className="font-semibold mb-1">Reason:</h4>
              <p className="text-sm">{result.reason}</p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
