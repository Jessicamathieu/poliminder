import SatisfactionReviewFormCard from '@/components/ai/SatisfactionReviewFormCard';
import IntelligentSchedulingFormCard from '@/components/ai/IntelligentSchedulingFormCard';
import AutomatedTaskAssignmentFormCard from '@/components/ai/AutomatedTaskAssignmentFormCard';

export default function AiToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary font-headline">AI-Powered Tools</h1>
        <p className="text-muted-foreground mt-2">Leverage artificial intelligence to enhance your operational efficiency.</p>
      </div>
      
      <IntelligentSchedulingFormCard />
      <AutomatedTaskAssignmentFormCard />
      <SatisfactionReviewFormCard />
      
    </div>
  );
}
