'use client';

import type { Service, Item } from '@/lib/types';
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
import { Checkbox } from '@/components/common/checkbox';
import { ScrollArea } from '@/components/common/scroll-area';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  durationMinutes: z.coerce.number().min(0, 'Duration must be non-negative').optional(),
  associatedItemIds: z.array(z.string()).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  service?: Service;
  allItems: Item[];
}

export default function ServiceFormDialog({
  isOpen,
  onClose,
  onSubmit,
  service,
  allItems,
}: ServiceFormDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, register, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      name: '',
      price: 0,
      associatedItemIds: [],
    },
  });

  const watchedAssociatedItemIds = watch('associatedItemIds', service?.associatedItemIds || []);

  const handleFormSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    try {
      await onSubmit(data);
      toast({ title: service ? "Service mis à jour" : "Service créé", description: "Le service a été enregistré avec succès." });
      reset();
      onClose();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le service. Veuillez réessayer.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? 'Modifier le service' : 'Créer un service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du service</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix ($)</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="durationMinutes">Durée (minutes)</Label>
              <Input id="durationMinutes" type="number" {...register('durationMinutes')} />
              {errors.durationMinutes && <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>}
            </div>
          </div>
          
          <div>
            <Label>Articles associés</Label>
            <ScrollArea className="h-40 rounded-md border p-2">
              {allItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 mb-1">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={watchedAssociatedItemIds?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      const currentIds = watchedAssociatedItemIds || [];
                      if (checked) {
                        setValue('associatedItemIds', [...currentIds, item.id]);
                      } else {
                        setValue('associatedItemIds', currentIds.filter(id => id !== item.id));
                      }
                    }}
                  />
                  <label htmlFor={`item-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {item.name}
                  </label>
                </div>
              ))}
            </ScrollArea>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (service ? 'Enregistrement...' : 'Création...') : (service ? 'Enregistrer' : 'Créer le service')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
