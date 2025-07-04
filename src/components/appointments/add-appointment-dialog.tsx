"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { add, format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, Service } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

const appointmentSchema = z.object({
  clientId: z.string().min(1, { message: "Veuillez sélectionner un client." }),
  serviceId: z.string().min(1, { message: "Veuillez sélectionner un service." }),
  date: z.date({ required_error: "Une date est requise." }),
  time: z.string().min(1, { message: "Une heure est requise." }),
  notes: z.string().optional(),
  isCompleted: z.boolean().default(false),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
};

export default function AddAppointmentDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const fetchClientsAndServices = async () => {
      try {
        const clientsSnapshot = await getDocs(collection(db, "clients"));
        setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

        const servicesSnapshot = await getDocs(collection(db, "services"));
        setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error("Failed to fetch clients or services:", error);
        toast({ variant: "destructive", title: "Erreur de chargement", description: "Impossible de charger les clients et services." });
      }
    };
    if (open) {
      fetchClientsAndServices();
    }
  }, [open, toast]);
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      notes: "",
      isCompleted: false,
    },
  });

  const handleClientChange = (clientId: string) => {
    form.setValue("clientId", clientId);
    setSelectedClient(clients.find(c => c.id === clientId) || null);
  };
  
  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      const selectedService = services.find(s => s.id === data.serviceId);
      if (!selectedClient || !selectedService) {
        throw new Error("Client ou service non trouvé.");
      }

      const [hours, minutes] = data.time.split(':').map(Number);
      const startDateTime = new Date(data.date);
      startDateTime.setHours(hours, minutes);
      
      // Placeholder pour la durée, à remplacer par la durée réelle du service
      const durationMinutes = 60; 
      const endDateTime = add(startDateTime, { minutes: durationMinutes });

      await addDoc(collection(db, "appointments"), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
        serviceIds: [selectedService.id],
        serviceNames: [selectedService.name],
        start: Timestamp.fromDate(startDateTime),
        end: Timestamp.fromDate(endDateTime),
        isCompleted: data.isCompleted,
        notes: data.notes,
        createdAt: Timestamp.now(),
      });

      toast({
        title: "✅ Rendez-vous ajouté !",
        description: `Le rendez-vous pour ${selectedClient.name} a été ajouté à l'agenda.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "❌ Oups ! Une erreur est survenue.",
        description: "Impossible d'ajouter le rendez-vous. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Rendez-vous
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rendez-vous</DialogTitle>
          <DialogDescription>Planifiez une nouvelle prestation pour un client.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={handleClientChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedClient && (
                <div className="space-y-2 rounded-md border bg-muted p-3 text-sm">
                    <p><strong>Téléphone :</strong> {selectedClient.phone}</p>
                    <p><strong>Adresse :</strong> {selectedClient.address}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? (format(field.value, "PPP", { locale: fr })) : (<span>Choisir une date</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                           <Clock className="mr-2 h-4 w-4 opacity-50" />
                          <SelectValue placeholder="Choisir une heure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ajouter des détails sur le rendez-vous..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Le service a déjà été effectué</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ajout en cours...</>) : ('Ajouter le rendez-vous')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
