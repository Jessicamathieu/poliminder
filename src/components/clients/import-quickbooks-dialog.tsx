
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookUser, Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QuickBooksCustomer {
  Id: string;
  DisplayName: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: { Line1: string; City: string; CountrySubDivisionCode: string; PostalCode: string; };
}

interface ImportQuickBooksDialogProps {
  onClientImported: () => void;
}

export default function ImportQuickBooksDialog({ onClientImported }: ImportQuickBooksDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<QuickBooksCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchQuickBooksCustomers();
    }
  }, [open]);

  const fetchQuickBooksCustomers = async () => {
    setIsLoading(true);
    setError(null);
    setCustomers([]);
    try {
      const response = await fetch('/api/quickbooks/clients');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch clients from QuickBooks.');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.includes("Not authenticated")) {
        setError("Vous n'êtes pas connecté à QuickBooks. Veuillez vous connecter depuis la page Admin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClient = async (customer: QuickBooksCustomer) => {
    try {
        const fullAddress = [
            customer.BillAddr?.Line1,
            customer.BillAddr?.City,
            customer.BillAddr?.CountrySubDivisionCode,
            customer.BillAddr?.PostalCode
        ].filter(Boolean).join(', ');

      const clientData = {
        name: customer.DisplayName,
        email: customer.PrimaryEmailAddr?.Address || 'Non fourni',
        phone: customer.PrimaryPhone?.FreeFormNumber || 'Non fourni',
        address: fullAddress || 'Non fournie',
        activeProjects: 0,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "clients"), clientData);

      toast({
        title: "Client importé !",
        description: `${customer.DisplayName} a été ajouté à votre liste de clients.`,
      });
      onClientImported(); // Refresh the client list on the main page
      setCustomers(prev => prev.filter(c => c.Id !== customer.Id)); // Remove from import list

    } catch (err) {
      console.error("Failed to import client:", err);
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: "Impossible d'importer ce client.",
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookUser className="mr-2 h-4 w-4" />
          Importer depuis QuickBooks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importer des Clients depuis QuickBooks</DialogTitle>
          <DialogDescription>
            Voici la liste de vos clients QuickBooks. Cliquez sur "Importer" pour les ajouter à PoliMindeR.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
          <div className="py-4 space-y-3">
            {isLoading && (
                [...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-52" />
                            </div>
                            <Skeleton className="h-9 w-24" />
                        </CardContent>
                    </Card>
                ))
            )}
            {error && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                <p className="font-semibold text-destructive">Erreur de chargement</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            )}
            {!isLoading && !error && customers.length === 0 && (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p>Aucun client à importer depuis QuickBooks.</p>
              </div>
            )}
            {!isLoading && !error && customers.map(customer => (
              <Card key={customer.Id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{customer.DisplayName}</p>
                    <p className="text-sm text-muted-foreground">{customer.PrimaryEmailAddr?.Address || 'Pas de courriel'}</p>
                  </div>
                  <Button size="sm" onClick={() => handleImportClient(customer)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Importer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
         <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
