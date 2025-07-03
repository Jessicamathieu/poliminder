"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Client } from "@/lib/types";
import AddClientForm from "@/components/clients/add-client-form";
import ClientCard from "@/components/clients/client-card";
import { Skeleton } from "@/components/ui/skeleton";

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
        // Optionnel : afficher un toast d'erreur
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
    // Rafraîchit la liste optimiste ou complète
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
        <div className="relative z-10 p-4 md:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
            
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <AddClientForm onClientAdded={handleAddClient} />
              </div>
            </aside>

            <section className="lg:col-span-3">
              <h1 className="mb-6 text-3xl font-bold tracking-tight font-headline">Vos Clients</h1>
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(3)].map((_, i) => <ClientCardSkeleton key={i} />)}
                </div>
              ) : clients.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {clients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-card rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold font-headline">Aucun client pour le moment</h3>
                  <p className="mt-2 text-muted-foreground">Utilisez le formulaire pour ajouter votre premier client !</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </>
    </AppLayout>
  );
}

const ClientCardSkeleton = () => (
  <div className="flex flex-col p-6 space-y-4 border rounded-xl shadow-sm bg-card">
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
    <div className="w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
            <div className="lg:col-span-1">
                 <Skeleton className="h-[580px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-3">
                <Skeleton className="h-10 w-64 mb-6" />
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {[...Array(3)].map((_, i) => <ClientCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    </div>
);
