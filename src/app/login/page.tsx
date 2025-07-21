
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createInitialUsers } from "@/lib/auth-actions";

export default function LoginPage() {
  const { loginWithEmail, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("jessica@poliminder.app");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInitializeUsers = async () => {
    setIsInitializing(true);
    try {
        await createInitialUsers();
        toast({
            title: "Utilisateurs initialisés !",
            description: "Les comptes pour Jessica et Mikael ont été créés. Vous pouvez maintenant vous connecter.",
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: errorMessage,
        });
    } finally {
        setIsInitializing(false);
    }
  };

  if (authLoading || user) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-background overflow-hidden">
      <div 
        className="absolute -top-1/4 -right-1/4 h-[150%] w-3/4"
        style={{
            background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
            transform: 'rotate(15deg)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            zIndex: 0
        }}
      />
      <div 
        className="absolute -top-1/4 -right-1/3 h-[150%] w-3/4"
        style={{
            backgroundColor: 'hsl(var(--foreground) / 0.9)',
            transform: 'rotate(25deg)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            zIndex: 0
        }}
      />
       
      <Card className="w-full max-w-md z-10 shadow-2xl animate-fade-in-up bg-card/80 backdrop-blur-sm border-0">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold font-headline text-primary">PoliMindeR</h1>
          <CardDescription className="pt-2">Votre assistant d'entreprise intelligent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                placeholder="jessica@poliminder.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-center text-muted-foreground pt-2">
                Utilisez jessica@poliminder.app (admin) ou mikael@poliminder.app (terrain) avec le mot de passe 'password123'.
            </p>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
             <div className="text-center">
                <Button type="button" variant="link" onClick={handleInitializeUsers} disabled={isInitializing}>
                     {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cliquez ici une seule fois pour créer les utilisateurs de démo.
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
