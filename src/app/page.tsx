
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Wallet, CalendarClock, AlertTriangle } from "lucide-react";
import KpiCard from "@/components/dashboard/kpi-card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import AppointmentsList from "@/components/dashboard/appointments-list";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import PageHeader from "@/components/layout/page-header";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [kpiAppointments, setKpiAppointments] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchAppointments = useCallback(() => {
    if (!user) return;
    setDataLoading(true);
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, where("start", ">=", Timestamp.now()), where("status", "==", "À venir"));

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
      setKpiAppointments(appointmentsData.length);
      setDataLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setDataLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if(user) {
      const unsubscribe = fetchAppointments();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user, loading, router, fetchAppointments]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-muted-foreground">Loading PoliMindeR...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title={user.role === 'admin' ? "Tableau de Bord de Jessica" : "Tableau de Bord de Mikael"} />
        {user.role === "admin" ? <AdminDashboard appointments={appointments} kpiAppointments={kpiAppointments} loading={dataLoading} /> : <FieldDashboard appointments={appointments} loading={dataLoading} />}
      </div>
    </AppLayout>
  );
}

const AdminDashboard = ({ appointments, kpiAppointments, loading }: { appointments: Appointment[], kpiAppointments: number, loading: boolean }) => (
  <div className="space-y-4">
    <Card className="bg-card/50 animate-fade-in-up">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Bonjour, Jessica !</CardTitle>
            <CardDescription>
                Voici une vue d'ensemble de votre entreprise aujourd'hui.
            </CardDescription>
        </CardHeader>
    </Card>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Revenus (ce mois-ci)"
        value="$12,345"
        icon={DollarSign}
        trend="+20.1% vs le mois dernier"
        animationDelay="100ms"
      />
      <KpiCard
        title="Dépenses (ce mois-ci)"
        value="$4,567"
        icon={Wallet}
        trend="+15% vs le mois dernier"
        trendColor="text-orange-500"
        animationDelay="200ms"
      />
      <KpiCard
        title="Factures en retard"
        value="5"
        icon={AlertTriangle}
        trend="2 nouvelles cette semaine"
        trendColor="text-destructive"
        animationDelay="300ms"
      />
      <KpiCard
        title="Rendez-vous à venir"
        value={loading ? "..." : kpiAppointments.toString()}
        icon={CalendarClock}
        trend="3 aujourd'hui"
        animationDelay="400ms"
      />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="font-headline text-primary">Aperçu des revenus</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <RevenueChart />
        </CardContent>
      </Card>
      <Card className="col-span-4 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="font-headline text-primary">Rendez-vous à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsList appointments={appointments} loading={loading} />
        </CardContent>
      </Card>
    </div>
  </div>
);

const FieldDashboard = ({ appointments, loading }: { appointments: Appointment[], loading: boolean }) => (
    <div className="space-y-4">
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="font-headline text-primary">Bonjour, Mikael !</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Voici un aperçu de votre journée. Prêt à commencer?</p>
            </CardContent>
        </Card>
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline text-primary">Vos rendez-vous à venir</CardTitle>
            </CardHeader>
            <CardContent>
                <AppointmentsList appointments={appointments} loading={loading}/>
            </CardContent>
        </Card>
    </div>
);
