"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickBooksConnectPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-primary">Connexion à QuickBooks</CardTitle>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour lier votre compte QuickBooks à PoliMindeR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <Link href="/api/quickbooks/auth">
              Connecter QuickBooks
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
