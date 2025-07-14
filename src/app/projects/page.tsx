
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileUp, Calendar, User, FolderKanban, MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, updateDoc, Timestamp } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type AppointmentStatus = "À venir" | "Terminé" | "Annulé";

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        } as Appointment;
      });
      setAppointments(appointmentsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);
  
  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    try {
      await updateDoc(appointmentRef, { status });
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la tâche a été changé à "${status}".`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
      });
    }
  };


  const handleNotImplemented = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Cette fonctionnalité est en cours de développement.",
    });
  };

  if (authLoading || isLoading || !user) {
    return (
      <AppLayout>
        <div className="relative z-10 flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
                    <FolderKanban className="mr-4 h-8 w-8 text-primary" />
                    Suivi des Tâches & Projets
                </h1>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-36" />
                    {user?.role === 'admin' && <Skeleton className="h-10 w-28" />}
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
        </div>
      </AppLayout>
    );
  }

  const getStatusVariant = (status?: string) => {
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
              <Card key={appointment.id} className="transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 flex flex-col">
                <CardHeader className="flex-row items-start justify-between">
                  <CardTitle className="font-headline text-lg text-primary">{appointment.serviceNames?.join(', ') || appointment.service}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'À venir')}>
                        Marquer comme "À venir"
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'Terminé')}>
                        Marquer comme "Terminé"
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'Annulé')}>
                        Marquer comme "Annulé"
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{appointment.clientName || appointment.client}</span>
                  </div>
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.start ? format(appointment.start, "d MMMM yyyy 'à' HH:mm", { locale: fr }) : 'Date inconnue'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-auto">
                     <Badge variant={getStatusVariant(appointment.status) as any}>{appointment.status || "N/A"}</Badge>
                     {user.role === 'admin' && appointment.amount && <span className="font-bold text-lg">${appointment.amount.toFixed(2)}</span>}
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


const ProjectCardSkeleton = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
            </div>
        </CardContent>
    </Card>
);

    