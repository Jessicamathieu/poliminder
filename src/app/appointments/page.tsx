"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Appointment } from "@/lib/types";
import { ChevronLeft, ChevronRight, PlusCircle, Camera } from "lucide-react";
import { add, format, startOfWeek, sub } from "date-fns";
import { fr } from "date-fns/locale";

import AppointmentWeekView from "@/components/appointments/appointment-week-view";
import AddAppointmentDialog from "@/components/appointments/add-appointment-dialog";
import ExtractFromPhotoDialog from "@/components/ai/extract-from-photo-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
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
    
    // Pour l'instant, on récupère tous les rendez-vous. 
    // On pourrait filtrer par date pour optimiser.
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

  if (authLoading || !user) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
            <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  const handleDateChange = (amount: number, unit: "days" | "weeks" | "months") => {
    setCurrentDate(add(currentDate, { [unit]: amount }));
  };
  
  const handlePrevious = () => {
    if (view === 'week') setCurrentDate(sub(currentDate, { weeks: 1 }));
    // Ajouter logique pour jour et mois
  };
  
  const handleNext = () => {
     if (view === 'week') setCurrentDate(add(currentDate, { weeks: 1 }));
    // Ajouter logique pour jour et mois
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formattedDate = () => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { locale: fr });
      const end = add(start, { days: 6 });
      return `${format(start, 'd MMMM', { locale: fr })} - ${format(end, 'd MMMM yyyy', { locale: fr })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale: fr });
  };
  
  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <header className="flex flex-none items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleToday} variant="default">Aujourd'hui</Button>
            <Button variant="ghost" size="icon" onClick={handlePrevious}><ChevronLeft/></Button>
            <Button variant="ghost" size="icon" onClick={handleNext}><ChevronRight /></Button>
            <h2 className="ml-4 text-lg font-semibold text-primary">{formattedDate()}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden rounded-md bg-muted p-0.5 sm:flex">
              <Button onClick={() => setView('day')} variant={view === 'day' ? 'outline' : 'ghost'} size="sm" disabled>Jour</Button>
              <Button onClick={() => setView('week')} variant={view === 'week' ? 'outline' : 'ghost'} size="sm">Semaine</Button>
              <Button onClick={() => setView('month')} variant={view === 'month' ? 'outline' : 'ghost'} size="sm" disabled>Mois</Button>
            </div>
            <ExtractFromPhotoDialog />
            <AddAppointmentDialog />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8">
              <Skeleton className="h-[600px] w-full" />
            </div>
          ) : (
            <AppointmentWeekView currentDate={currentDate} appointments={appointments} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
