"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, CalendarClock, AlertTriangle, Users, Briefcase, FileText, Settings } from "lucide-react";
import KpiCard from "@/components/dashboard/kpi-card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import AppointmentsList from "@/components/dashboard/appointments-list";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
              {user.role === 'admin' ? "Tableau de Bord de Jessica" : "Tableau de Bord de Mikael"}
            </h1>
          </div>
          {user.role === "admin" ? <AdminDashboard /> : <FieldDashboard />}
        </div>
      </>
    </AppLayout>
  );
}

const AdminDashboard = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Revenus (ce mois-ci)"
        value="$12,345"
        icon={DollarSign}
        trend="+20.1% vs le mois dernier"
      />
      <KpiCard
        title="Dépenses (ce mois-ci)"
        value="$4,567"
        icon={Wallet}
        trend="+15% vs le mois dernier"
        trendColor="text-orange-500"
      />
      <KpiCard
        title="Factures en retard"
        value="5"
        icon={AlertTriangle}
        trend="2 nouvelles cette semaine"
        trendColor="text-destructive"
      />
      <KpiCard
        title="Rendez-vous à venir"
        value="8"
        icon={CalendarClock}
        trend="3 aujourd'hui"
      />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Aperçu des revenus</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <RevenueChart />
        </CardContent>
      </Card>
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Rendez-vous à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsList />
        </CardContent>
      </Card>
    </div>
  </div>
);

const FieldDashboard = () => (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-primary">Bonjour, Mikael!</CardTitle>
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
                <AppointmentsList />
            </CardContent>
        </Card>
    </div>
);
