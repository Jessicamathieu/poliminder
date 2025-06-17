'use client';

import type { Appointment, Client, Employee, Service } from '@/lib/types';
import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/common/dialog';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Textarea } from '@/components/common/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { Calendar } from '@/components/common/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.date({ required_error: "Start date is required." }),
  end: z.date({ required_error: "End date is required." }),
  clientId: z.string().optional(),
  employeeId: z.string().optional(),
  serviceId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).default('scheduled'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  appointment?: Appointment;
  clients: Client[];
  employees: Employee[];
  services: Service[];
}

export default function AppointmentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  clients,
  employees,
  services,
}: AppointmentFormDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment
      ? {
          ...appointment,
          start: appointment.start ? parseISO(appointment.start.toString()) : new Date(),
          end: appointment.end ? parseISO(appointment.end.toString()) : new Date(),
        }
      : {
          title: '',
          start: new Date(),
          end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
          status: 'scheduled',
        },
  });

  const handleFormSubmit: SubmitHandler<AppointmentFormData> = async (data) => {
    try {
      await onSubmit(data);
      toast({ title: appointment ? "Rendez-vous mis à jour" : "Rendez-vous créé", description: "Le rendez-vous a été enregistré avec succès." });
      reset();
      onClose();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le rendez-vous. Veuillez réessayer.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Modifier le rendez-vous' : 'Créer un rendez-vous'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Date et heure de début</Label>
              <Controller
                name="start"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPPp") : <span>Choisissez une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      <div className="p-2 border-t border-border">
                        <Input type="time" defaultValue={field.value ? format(field.value, "HH:mm") : ""} 
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours, minutes);
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.start && <p className="text-sm text-destructive">{errors.start.message}</p>}
            </div>
            <div>
              <Label htmlFor="end">Date et heure de fin</Label>
               <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPPp") : <span>Choisissez une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                       <div className="p-2 border-t border-border">
                        <Input type="time" defaultValue={field.value ? format(field.value, "HH:mm") : ""} 
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours, minutes);
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.end && <p className="text-sm text-destructive">{errors.end.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="clientId">Client</Label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Choisir un client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="employeeId">Employé</Label>
             <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Choisir un employé" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="serviceId">Service</Label>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Choisir un service" /></SelectTrigger>
                  <SelectContent>
                    {services.map(service => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="location">Lieu</Label>
            <div className="flex items-center gap-2">
              <Input id="location" {...register('location')} placeholder="ex. 123 rue Principale, Ville" />
              {appointment?.location && (
                 <Button variant="outline" size="icon" asChild>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Controller
                name="status"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir le statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="scheduled">Planifié</SelectItem>
                            <SelectItem value="confirmed">Confirmé</SelectItem>
                            <SelectItem value="completed">Terminé</SelectItem>
                            <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
          </div>
          
          {appointment?.clientName && appointment?.clientId && clients.find(c => c.id === appointment.clientId)?.phone && (
            <div className="mt-2">
               <Button variant="outline" size="sm" asChild>
                <a href={`tel:${clients.find(c => c.id === appointment.clientId)?.phone}`}>
                  <Phone className="mr-2 h-4 w-4" /> Appeler le client ({clients.find(c => c.id === appointment.clientId)?.phone})
                </a>
              </Button>
            </div>
          )}


          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (appointment ? 'Enregistrement...' : 'Création...') : (appointment ? 'Enregistrer' : 'Créer le rendez-vous')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
