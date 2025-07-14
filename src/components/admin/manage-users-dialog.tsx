
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const initialUsers = [
    { id: 'usr_jess', name: 'Jessica', email: 'jessica@poliminder.app', role: 'admin', avatar: `https://placehold.co/32x32.png` },
    { id: 'usr_mika', name: 'Mikael', email: 'mikael@poliminder.app', role: 'field', avatar: `https://placehold.co/32x32.png` },
];


export default function ManageUsersDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
        title: "Action non disponible",
        description: `La fonctionnalité "${action}" sera bientôt disponible.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Gérer les Utilisateurs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestion des Utilisateurs</DialogTitle>
          <DialogDescription>
            Gérez les accès et les rôles des membres de votre équipe.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleAction("Modifier")}>Modifier</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("Réinitialiser le mot de passe")}>Réinitialiser le mot de passe</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleAction("Supprimer")}>
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => handleAction("Inviter un utilisateur")}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Inviter un utilisateur
            </Button>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
