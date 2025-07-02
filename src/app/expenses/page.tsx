"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expenses } from "@/lib/data";
import ExpenseFormAI from "@/components/ai/expense-form-ai";

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dépenses</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Ajouter une dépense avec l'IA</CardTitle>
                    <CardDescription>Décrivez votre dépense en langage naturel. Par exemple : "Ajoute une dépense essence 80$ chez Shell".</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseFormAI />
                </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Dépenses Récentes</CardTitle>
                 <CardDescription>Voici la liste de vos dernières dépenses enregistrées.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Vendeur</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="font-medium">{expense.vendor}</TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
