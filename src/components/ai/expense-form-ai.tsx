"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addExpenseViaAI, AddExpenseViaAIOutput } from "@/ai/flows/add-expense-via-ai";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  expenseText: z.string().min(10, {
    message: "Veuillez décrire la dépense plus en détail.",
  }),
});

export default function ExpenseFormAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AddExpenseViaAIOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseText: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const aiResult = await addExpenseViaAI(values);
      setResult(aiResult);
      if (aiResult.success) {
        toast({
          title: "Dépense ajoutée!",
          description: aiResult.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de traitement",
          description: aiResult.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de l'ajout de la dépense.",
      });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="expenseText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Ex: Dépense de 80$ pour de l'essence chez Shell le 15/07" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter la Dépense
          </Button>
        </form>
      </Form>
      {result && (
        <Card className="mt-4 animate-fade-in">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 font-headline">Résultat du traitement</h4>
            <p className={`text-sm ${result.success ? 'text-green-600' : 'text-destructive'}`}>
              {result.message}
            </p>
            {result.success && result.expenseDetails && (
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p><strong>Catégorie:</strong> {result.expenseDetails.category}</p>
                <p><strong>Vendeur:</strong> {result.expenseDetails.vendor}</p>
                <p><strong>Montant:</strong> ${result.expenseDetails.amount?.toFixed(2)}</p>
                <p><strong>Date:</strong> {result.expenseDetails.date}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
