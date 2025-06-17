import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import Image from "next/image";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">Intégrations</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image src="https://placehold.co/100x100.png" alt="QuickBooks Logo" width={64} height={64} data-ai-hint="accounting software logo" className="rounded-md" />
            <div>
              <CardTitle className="text-2xl">Synchronisation QuickBooks</CardTitle>
              <CardDescription>Gardez vos clients, factures et dépenses synchronisés avec QuickBooks.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            PoliMinder offre une intégration complète avec QuickBooks pour simplifier votre comptabilité et la gestion des clients.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Données client :</strong> Synchronisation bidirectionnelle du nom, de l'adresse, du téléphone et de l'e-mail.</li>
            <li><strong>Factures & dépenses :</strong> Synchronisation depuis QuickBooks vers PoliMinder pour consultation.</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="default" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Synchroniser maintenant (exemple)
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" /> Configurer la synchro (exemple)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Dernière synchro : jamais (exemple)
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">Autres intégrations</CardTitle>
            <CardDescription>Découvrez d'autres intégrations possibles pour enrichir PoliMinder.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Nous cherchons toujours à étendre nos intégrations. Si vous avez des suggestions de services à connecter à PoliMinder, faites-le nous savoir !
            </p>
             <Image src="https://placehold.co/600x300.png" alt="Integration concept" width={600} height={300} className="rounded-md my-4" data-ai-hint="integration connection" />
        </CardContent>
      </Card>
    </div>
  );
}
