
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { FileText } from "lucide-react";

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
      <>
        <div
          className="absolute inset-x-0 top-0 z-0 h-96"
          style={{
              background: 'linear-gradient(145deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.0) 70%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 60%, 75% 80%, 0 65%)'
          }}
        />
        <div
            className="absolute inset-x-0 top-0 z-0 h-96 opacity-50"
            style={{
                background: 'linear-gradient(215deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.0) 70%)',
                clipPath: 'polygon(100% 0, 100% 80%, 50% 70%, 25% 100%, 0 80%, 0 0)'
            }}
        />
        <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight font-headline">
              <FileText className="h-8 w-8 text-primary" />
              Rapports Avancés
            </h1>
          </div>
          
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
      </>
    </AppLayout>
  );
}
