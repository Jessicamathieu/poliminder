
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ExpenseFormAI from "@/components/ai/expense-form-ai";
import { Wallet } from "lucide-react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Expense } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/page-header";

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const fetchExpenses = useCallback(() => {
    if (!user) return;
    setIsLoading(true);
    const expensesCol = collection(db, 'expenses');
    const q = query(expensesCol, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as Expense;
      });
      setExpenses(expensesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching expenses:", error);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);
  
  useEffect(() => {
    const unsubscribe = fetchExpenses();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchExpenses]);


  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title={
          <>
            <Wallet className="h-8 w-8 text-primary" />
            Dépenses
          </>
        } />
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Ajouter une dépense avec l'IA</CardTitle>
                    <CardDescription>Prenez une photo de votre reçu ou importez une image pour que l'IA en extraie les informations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseFormAI />
                </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-primary">Dépenses Récentes</CardTitle>
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
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                         <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                         </TableRow>
                      ))
                    ) : expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>{format(expense.date, "PPP", { locale: fr })}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell className="font-medium">{expense.vendor}</TableCell>
                            <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                              Aucune dépense enregistrée pour le moment.
                          </TableCell>
                      </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
