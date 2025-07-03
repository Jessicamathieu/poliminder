"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { services } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="flex h-screen items-center justify-center">Loading or redirecting...</div>;
  }

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
            <h1 className="text-3xl font-bold tracking-tight font-headline">Services</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Service
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Liste des Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Service</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell className="text-right">${service.price.toFixed(2)}</TableCell>
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
