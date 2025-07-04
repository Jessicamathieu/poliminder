"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
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
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Page d'Administration
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-primary">Paramètres de l'Application</CardTitle>
              <CardDescription>
                Gérez ici les paramètres globaux, les utilisateurs et les intégrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg">
                  <h3 className="font-headline text-lg mb-2 text-primary">Gestion des Utilisateurs</h3>
                  <p className="text-muted-foreground mb-4">Ajoutez, modifiez ou supprimez des utilisateurs.</p>
                  <Button>Gérer les Utilisateurs</Button>
              </div>
              <div className="p-6 border rounded-lg">
                  <h3 className="font-headline text-lg mb-2 text-primary">Intégration QuickBooks</h3>
                  <p className="text-muted-foreground mb-4">Connectez-vous à votre compte QuickBooks Canada.</p>
                  <Button variant="secondary">Connecter QuickBooks</Button>
              </div>
              <div className="p-6 border rounded-lg">
                  <h3 className="font-headline text-lg mb-2 text-primary">Rapports Avancés</h3>
                  <p className="text-muted-foreground mb-4">Générez des rapports financiers et opérationnels détaillés.</p>
                  <Button>Voir les Rapports</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    </AppLayout>
  );
}
