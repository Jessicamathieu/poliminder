
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Service } from "@/lib/types";
import AddServiceDialog from "@/components/services/add-service-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/page-header";

export default function ServicesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const servicesCollection = collection(db, "services");
      const q = query(servicesCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      setServices(servicesData);
    } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
    } finally {
        setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        fetchServices();
      }
    }
  }, [user, authLoading, router, fetchServices]);

  const handleAddService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    const servicesCollection = collection(db, "services");
    await addDoc(servicesCollection, {
      ...serviceData,
      createdAt: serverTimestamp(),
    });
    fetchServices(); // Refresh the list
  };
  
  if (authLoading || !user || user.role !== 'admin') {
    return <div className="flex h-screen items-center justify-center">Loading or redirecting...</div>;
  }

  return (
    <AppLayout>
      <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title="Services">
            <AddServiceDialog onServiceAdded={handleAddService} />
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-primary">Liste des Services</CardTitle>
            <CardDescription>Gérez ici les prestations que votre entreprise propose.</CardDescription>
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
                {isLoading ? (
                  <>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </>
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell className="text-right">${service.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                          Aucun service trouvé. Ajoutez-en un pour commencer.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
    </TableRow>
)
