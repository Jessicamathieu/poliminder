'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      toast({ title: 'Recommandation prête', description: "L'IA a proposé une suggestion." });
    } catch (error) {
      console.error('Error getting scheduling recommendations:', error);
      toast({ title: 'Erreur', description: 'Impossible d\'obtenir des recommandations.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><CalendarCog className="mr-2 h-6 w-6 text-accent" /> Recommandations de planification intelligente</CardTitle>
        <CardDescription>Obtenez des suggestions optimisées grâce à l'IA.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="employeeAvailabilityIs">Disponibilité de l'employé</Label>
            <Input id="employeeAvailabilityIs" {...register('employeeAvailability')} placeholder="ex. Lun-ven 9h-17h, indisponible mercredi après-midi" />
            {errors.employeeAvailability && <p className="text-sm text-destructive">{errors.employeeAvailability.message}</p>}
          </div>
          <div>
            <Label htmlFor="locationIs">Lieu du rendez-vous</Label>
            <Input id="locationIs" {...register('location')} placeholder="ex. centre-ville ou adresse précise" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="serviceTypeIs">Type de service</Label>
            <Input id="serviceTypeIs" {...register('serviceType')} placeholder="ex. Nettoyage extérieur, lavage de vitres" />
            {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType.message}</p>}
          </div>
          <div>
            <Label htmlFor="workloadIs">Charge actuelle de l'employé</Label>
            <Input id="workloadIs" {...register('workload')} placeholder="ex. Légère, 3 rendez-vous aujourd'hui" />
            {errors.workload && <p className="text-sm text-destructive">{errors.workload.message}</p>}
          </div>
           <div>
            <Label htmlFor="skillsIs">Compétences de l'employé</Label>
            <Input id="skillsIs" {...register('skills')} placeholder="ex. Nettoyage de gouttières, haute pression, travail en hauteur" />
            {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {isLoading ? 'Recherche...' : 'Obtenir des recommandations'}
          </Button>
          {result && (
            <div className="w-full p-4 border rounded-md bg-muted">
              <h4 className="font-semibold mb-1">Recommandation :</h4>
              <p className="text-sm mb-2">{result.recommendation}</p>
              <h4 className="font-semibold mb-1">Raison :</h4>
              <p className="text-sm">{result.reason}</p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
