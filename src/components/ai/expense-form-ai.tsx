
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, UploadCloud, FileImage } from "lucide-react";
import { cn } from '@/lib/utils';

export default function ExpenseFormAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
        description: "Veuillez choisir une photo de reçu à analyser.",
      });
      return;
    }

    setIsProcessing(true);
    
    // TODO: Connect to Genkit flow for expense extraction
    // For now, we simulate the process and show a notification.
    toast({
      title: "Analyse en cours...",
      description: "L'IA analyse votre reçu. Cette fonctionnalité est en cours de développement.",
    });
    console.log("Processing file for expense extraction:", selectedFile.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // On a real implementation, you would get data back from the AI
    // and potentially pre-fill an expense form or save it directly.
    toast({
        title: "Extraction terminée !",
        description: "Les informations du reçu ont été (simulées) extraites avec succès.",
    });

    setIsProcessing(false);
    setSelectedFile(null);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
        <label
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            htmlFor="receipt-upload"
            className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors",
                isDragging && "border-primary bg-primary/10"
            )}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Cliquez pour téléverser</span> ou glissez-déposez
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou GIF (MAX. 10MB)</p>
            </div>
            <Input id="receipt-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>

        {selectedFile && (
            <div className="flex items-center gap-3 p-3 rounded-md border bg-muted">
                <FileImage className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium truncate">{selectedFile.name}</span>
            </div>
        )}

        <Button onClick={handleProcess} disabled={isProcessing || !selectedFile} size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Extraire les informations
              </>
            )}
        </Button>
    </div>
  );
};
