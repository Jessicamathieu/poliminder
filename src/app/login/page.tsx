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
