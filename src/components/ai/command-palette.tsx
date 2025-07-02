"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { processAICommand } from "@/ai/flows/process-ai-commands";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await processAICommand({ command });
      if (result.processed) {
        toast({
          title: "Commande traitée",
          description: result.result,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de commande",
          description: result.result,
        });
      }
      onOpenChange(false);
      setCommand("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter la commande.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Palette de Commandes IA</DialogTitle>
          <DialogDescription>
            Entrez une commande comme "Montre-moi les revenus de mai" ou "Facture les rendez-vous de cette semaine".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            id="command"
            placeholder="Votre commande..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !command.trim()}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Exécuter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
