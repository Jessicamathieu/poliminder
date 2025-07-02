"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield } from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(user) {
        router.push('/');
    }
  }, [user, router]);

  const handleLogin = (role: "admin" | "field") => {
    if (role === "admin") {
      login({ name: "Jessica", role: "admin" });
    } else {
      login({ name: "Mikael", role: "field" });
    }
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-secondary">
       <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      <Card className="w-full max-w-md z-10 shadow-2xl animate-fade-in-up">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold font-headline text-primary">PoliMindeR</h1>
          <CardDescription className="pt-2">Votre assistant d'entreprise intelligent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">Sélectionnez un rôle pour vous connecter</p>
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={() => handleLogin("admin")}
          >
            <Shield className="mr-2 h-5 w-5" />
            Se connecter en tant que Jessica (Admin)
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full text-lg py-6"
            onClick={() => handleLogin("field")}
          >
            <User className="mr-2 h-5 w-5" />
            Se connecter en tant que Mikael (Terrain)
          </Button>
        </CardContent>
      </Card>
      <style jsx>{`
        .bg-grid-pattern {
            background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
            background-size: 2rem 2rem;
        }
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
