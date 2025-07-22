
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Appointment } from "@/lib/types";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { add, format, startOfWeek, sub } from "date-fns";
import { fr } from "date-fns/locale";

import AppointmentWeekView from "@/components/appointments/appointment-week-view";
import AddAppointmentDialog from "@/components/appointments/add-appointment-dialog";
import ExtractFromPhotoDialog from "@/components/ai/extract-from-photo-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/page-header";

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
  
  const handlePrevious = () => {
    if (view === 'week') setCurrentDate(sub(currentDate, { weeks: 1 }));
  };
  
  const handleNext = () => {
     if (view === 'week') setCurrentDate(add(currentDate, { weeks: 1 }));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formattedDate = () => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { locale: fr });
      const end = add(start, { days: 6 });
      const startMonth = format(start, 'MMMM', { locale: fr });
      const endMonth = format(end, 'MMMM', { locale: fr });
      const startYear = format(start, 'yyyy', { locale: fr });
      const endYear = format(end, 'yyyy', { locale: fr });

      if (startMonth === endMonth) {
        return `${format(start, 'd')} - ${format(end, 'd MMMM yyyy', { locale: fr })}`;
      } else if (startYear === endYear) {
         return `${format(start, 'd MMMM', { locale: fr })} - ${format(end, 'd MMMM yyyy', { locale: fr })}`;
      }
      return `${format(start, 'd MMMM yyyy', { locale: fr })} - ${format(end, 'd MMMM yyyy', { locale: fr })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale: fr });
  };
  
  return (
    <AppLayout>
      <div className="relative z-10 flex h-full flex-col p-4 pt-6 md:p-8">
        <PageHeader title={
            <>
                <Calendar className="h-8 w-8 text-primary" />
                Agenda
            </>
        }>
            <ExtractFromPhotoDialog />
            <AddAppointmentDialog />
        </PageHeader>
        
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-lg mt-8">
          <header className="flex flex-none items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Button onClick={handleToday} variant="outline" className="hidden sm:flex">Aujourd'hui</Button>
              <div className="flex items-center rounded-md border">
                <Button variant="ghost" size="icon" className="h-9 w-9 border-r rounded-r-none" onClick={handlePrevious}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <h2 className="text-lg font-semibold capitalize text-foreground">{formattedDate()}</h2>
            </div>
            <div className="hidden rounded-md bg-muted p-0.5 sm:flex">
              <Button onClick={() => setView('day')} variant={view === 'day' ? 'secondary' : 'ghost'} size="sm" disabled>Jour</Button>
              <Button onClick={() => setView('week')} variant={view === 'week' ? 'secondary' : 'ghost'} size="sm">Semaine</Button>
              <Button onClick={() => setView('month')} variant={view === 'month' ? 'secondary' : 'ghost'} size="sm" disabled>Mois</Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-background/50">
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </div>
            ) : (
              <AppointmentWeekView currentDate={currentDate} appointments={appointments} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
