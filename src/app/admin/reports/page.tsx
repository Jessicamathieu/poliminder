
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { FileText } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== 'admin') {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
     <div className="flex h-screen items-center justify-center bg-background">
       <p>Loading or redirecting...</p>
     </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title={
          <>
            <FileText className="h-8 w-8 text-primary" />
            Rapports Avancés
          </>
        } />
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-primary">Rapport de Revenus</CardTitle>
              <CardDescription>Vue d'ensemble des revenus mensuels.</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-primary">Analyse des Dépenses</CardTitle>
              <CardDescription>Répartition des dépenses par catégorie.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[350px]">
              <p className="text-muted-foreground">Graphique des dépenses à venir.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
