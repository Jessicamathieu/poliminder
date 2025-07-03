"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { appointments } from "@/lib/data";
import { PlusCircle, FileUp } from "lucide-react";

export default function AppointmentsPage() {
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

  return (
    <AppLayout>
      <>
        <div 
          className="absolute inset-x-0 top-0 z-0 h-64 w-full"
          style={{
              background: 'hsl(var(--primary) / 0.05)',
              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)'
          }}
        />
        <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Rendez-vous</h1>
            <div className="flex items-center space-x-2">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Rendez-vous
              </Button>
              {user.role === 'admin' && (
                <Button variant="outline">
                  <FileUp className="mr-2 h-4 w-4" />
                  Facturer les rendez-vous terminés
                </Button>
              )}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Liste des Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Statut</TableHead>
                    {user.role === 'admin' && <TableHead className="text-right">Montant</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.client}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appointment.status) as any}>{appointment.status}</Badge>
                      </TableCell>
                      {user.role === 'admin' && <TableCell className="text-right">${appointment.amount.toFixed(2)}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </>
    </AppLayout>
  );
}
