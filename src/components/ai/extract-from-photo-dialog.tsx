
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractAppointments } from "@/ai/flows/extract-appointments-flow";

export default function ExtractFromPhotoDialog() {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Aucun fichier sélectionné",
        description: "Veuillez choisir une photo à analyser.",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Analyse IA en cours...",
      description: "L'IA lit votre agenda, veuillez patienter."
    });

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        const currentYear = new Date().getFullYear();
        const result = await extractAppointments({ photoDataUri: dataUri, currentYear });
        
        toast({
          title: "✅ Extraction réussie !",
          description: `${result.appointments.length} rendez-vous ont été trouvés et ajoutés à l'agenda.`
        });
        setOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error extracting appointments:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'extraction",
          description: "L'IA n'a pas pu traiter l'image. Veuillez réessayer."
        });
      } finally {
        setIsProcessing(false);
      }
    };
     reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({
            variant: "destructive",
            title: "Erreur de lecture du fichier",
            description: "Impossible de lire le fichier sélectionné.",
        });
        setIsProcessing(false);
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Camera className="mr-2 h-4 w-4" />
          Extraire d'une photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extraire les rendez-vous d'une photo</DialogTitle>
          <DialogDescription>
            Envoyez une photo de votre agenda papier. L'IA lira les informations et les ajoutera à votre calendrier.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-2 py-4">
          <Label htmlFor="picture">Photo de l'agenda</Label>
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isProcessing}>Annuler</Button>
          <Button onClick={handleProcess} disabled={isProcessing || !selectedFile}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Lancer l'extraction
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
