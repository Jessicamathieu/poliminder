import SatisfactionReviewFormCard from '@/components/ai/SatisfactionReviewFormCard';
import IntelligentSchedulingFormCard from '@/components/ai/IntelligentSchedulingFormCard';
import AutomatedTaskAssignmentFormCard from '@/components/ai/AutomatedTaskAssignmentFormCard';

export default function AiToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary font-headline">Outils propulsés par l'IA</h1>
        <p className="text-muted-foreground mt-2">Exploitez l'intelligence artificielle pour améliorer votre efficacité opérationnelle.</p>
      </div>
      
      <IntelligentSchedulingFormCard />
      <AutomatedTaskAssignmentFormCard />
      <SatisfactionReviewFormCard />
      
    </div>
  );
}
