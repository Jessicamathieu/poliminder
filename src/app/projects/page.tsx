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

export default function ProjectsPage() {
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
       <div className="relative h-full">
        <div
          className="absolute inset-x-0 top-0 z-0 h-full"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary)/.15) 0%, hsl(var(--background)) 50%)'
          }}
        />
        <div className="relative z-10 flex-1 space-y-8 p-4 md:p-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
              <FolderKanban className="mr-4 h-8 w-8" />
              Suivi des Tâches & Projets
            </h1>
            <div className="flex items-center space-x-2">
              <Button className="shadow-lg hover:shadow-primary/40">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle Tâche
              </Button>
              {user.role === 'admin' && (
                <Button variant="outline" className="shadow-lg">
                  <FileUp className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="border-2 border-primary/20 rounded-2xl shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 ease-in-out">
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
                    <span>{format(appointment.start, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
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
      </div>
    </AppLayout>
  );
}
