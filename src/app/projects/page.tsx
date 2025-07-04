"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointments as staticAppointments } from "@/lib/data";
import { PlusCircle, FileUp, Calendar, User, FolderKanban } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleNotImplemented = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Cette fonctionnalité est en cours de développement.",
    });
  };

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Terminé":
        return "default";
      case "À venir":
        return "secondary";
      case "Annulé":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Utilisons les données statiques pour cette page de suivi
  const appointments = staticAppointments;

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
        <div className="relative z-10 flex-1 space-y-8 p-4 md:p-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
              <FolderKanban className="mr-4 h-8 w-8 text-primary" />
              Suivi des Tâches & Projets
            </h1>
            <div className="flex items-center space-x-2">
              <Button onClick={handleNotImplemented}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle Tâche
              </Button>
              {user.role === 'admin' && (
                <Button variant="outline" onClick={handleNotImplemented}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-primary">{appointment.service}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{appointment.client}</span>
                  </div>
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.start ? format(appointment.start, "d MMMM yyyy 'à' HH:mm", { locale: fr }) : 'Date inconnue'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                     <Badge variant={getStatusVariant(appointment.status) as any}>{appointment.status}</Badge>
                     {user.role === 'admin' && <span className="font-bold text-lg">${appointment.amount.toFixed(2)}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    </AppLayout>
  );
}
