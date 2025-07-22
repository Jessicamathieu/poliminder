'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Client } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }),
  phone: z.string().min(10, { message: 'Le numéro de téléphone doit être valide.' }),
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
});

type AddClientDialogProps = {
  onClientAdded: (client: Omit<z.infer<typeof formSchema>, 'id' | 'activeProjects' | 'createdAt'>) => Promise<void>;
};

export default function AddClientDialog({ onClientAdded }: AddClientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await onClientAdded(values);
      toast({
        title: '✅ Client ajouté !',
        description: `${values.name} a été ajouté à votre liste de clients.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        variant: 'destructive',
        title: '❌ Oups ! Une erreur est survenue.',
        description: "Impossible d'ajouter le client. Veuillez réessayer.",
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
          Ajouter un client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Nouveau Client</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau profil client.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marie Tremblay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courriel</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: marie.t@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: (514) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: 1234 Rue de la Paix, Montréal..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ajout en cours...
                    </>
                    ) : (
                    'Ajouter le client'
                    )}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
