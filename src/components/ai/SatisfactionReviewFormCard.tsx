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
import { generateSatisfactionReviewRequest, type GenerateSatisfactionReviewRequestInput, type GenerateSatisfactionReviewRequestOutput } from '@/ai/flows/generate-satisfaction-review-request';
import { MessageSquareHeart } from 'lucide-react';

const FormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  serviceName: z.string().min(1, 'Service name is required'),
  googleReviewsPageLink: z.string().url('Must be a valid URL for Google Reviews page'),
});

type FormData = z.infer<typeof FormSchema>;

export default function SatisfactionReviewFormCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateSatisfactionReviewRequestOutput | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      googleReviewsPageLink: 'https://g.page/review/YOUR_BUSINESS_ID_HERE' // Placeholder
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateSatisfactionReviewRequest(data);
      setResult(response);
      toast({ title: 'Review Request Generated', description: 'Message created successfully.' });
      reset(data); // Keep current data in form for potential re-send/copy
    } catch (error) {
      console.error('Error generating satisfaction review:', error);
      toast({ title: 'Error', description: 'Failed to generate review request.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full" id="satisfaction-review">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><MessageSquareHeart className="mr-2 h-6 w-6 text-accent" /> Generate Satisfaction Review Request</CardTitle>
        <CardDescription>Craft a personalized thank you message and review invitation for your client.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientNameSr">Client Name</Label>
            <Input id="clientNameSr" {...register('clientName')} placeholder="e.g., John Doe" />
            {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
          </div>
          <div>
            <Label htmlFor="serviceNameSr">Service Provided</Label>
            <Input id="serviceNameSr" {...register('serviceName')} placeholder="e.g., Exterior Cleaning" />
            {errors.serviceName && <p className="text-sm text-destructive">{errors.serviceName.message}</p>}
          </div>
          <div>
            <Label htmlFor="googleReviewsPageLinkSr">Google Reviews Page Link</Label>
            <Input id="googleReviewsPageLinkSr" {...register('googleReviewsPageLink')} placeholder="https://g.page/review/..." />
            {errors.googleReviewsPageLink && <p className="text-sm text-destructive">{errors.googleReviewsPageLink.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {isLoading ? 'Generating...' : 'Generate Message'}
          </Button>
          {result && (
            <div className="w-full p-4 border rounded-md bg-muted">
              <h4 className="font-semibold mb-2">Generated Message:</h4>
              <Textarea value={result.message} readOnly rows={5} className="bg-background text-sm" />
              <Button variant="outline" size="sm" className="mt-2" onClick={() => navigator.clipboard.writeText(result.message).then(() => toast({title: 'Copied!', description: 'Message copied to clipboard.'}))}>
                Copy Message
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
