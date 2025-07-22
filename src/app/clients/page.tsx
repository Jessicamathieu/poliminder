
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Client } from "@/lib/types";
import AddClientDialog from "@/components/clients/add-client-dialog";
import ClientCard from "@/components/clients/client-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function ClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const clientsCollection = collection(db, "clients");
      const q = query(clientsCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];
      setClients(clientsData);
    } catch (error) {
        console.error("Failed to fetch clients:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchClients();
      }
    }
  }, [user, authLoading, router, fetchClients]);

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'activeProjects' | 'createdAt'>) => {
    const clientsCollection = collection(db, "clients");
    await addDoc(clientsCollection, {
      ...clientData,
      activeProjects: 0,
      createdAt: serverTimestamp(),
    });
    fetchClients();
  };
  
  if (authLoading || !user) {
    return (
      <AppLayout>
          <div className="flex h-full items-center justify-center p-8">
            <ClientPageSkeleton />
          </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative z-10 flex-1 space-y-8 p-4 md:p-8 pt-6">
          <PageHeader title={
            <>
                <Users className="h-8 w-8 text-primary" />
                Vos Clients
            </>
          }>
              <AddClientDialog onClientAdded={handleAddClient} />
          </PageHeader>

          {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => <ClientCardSkeleton key={i} />)}
          </div>
          ) : clients.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
              ))}
          </div>
          ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-card rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold font-headline text-primary">Aucun client pour le moment</h3>
              <p className="mt-2 text-muted-foreground">Cliquez sur "Ajouter un client" pour commencer !</p>
          </div>
          )}
      </div>
    </AppLayout>
  );
}

const ClientCardSkeleton = () => (
  <div className="flex flex-col p-6 space-y-4 border rounded-xl shadow-sm bg-card transition-all duration-300">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="w-full space-y-2">
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
    <div className="space-y-3">
       <Skeleton className="h-10 w-full" />
       <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-full mt-2" />
  </div>
);

const ClientPageSkeleton = () => (
    <div className="relative z-10 w-full space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <ClientCardSkeleton key={i} />)}
        </div>
    </div>
);
