import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { RefreshCw, Settings } from "lucide-react";
import Image from "next/image";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">Integrations</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image src="https://placehold.co/100x100.png" alt="QuickBooks Logo" width={64} height={64} data-ai-hint="accounting software logo" className="rounded-md" />
            <div>
              <CardTitle className="text-2xl">QuickBooks Sync</CardTitle>
              <CardDescription>Keep your client data, invoices, and expenses synchronized with QuickBooks.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            PoliMinder offers robust integration with QuickBooks to streamline your accounting and client management.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Client Data:</strong> Bidirectional sync for client name, address, phone, and email.</li>
            <li><strong>Invoices & Expenses:</strong> Unidirectional sync from QuickBooks to PoliMinder for viewing and reference.</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="default" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Sync Now (Placeholder)
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" /> Configure Sync (Placeholder)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Last synced: Never (Placeholder)
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">Other Integrations</CardTitle>
            <CardDescription>Explore other potential integrations to enhance PoliMinder.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                We are always looking to expand our integration capabilities. If you have suggestions for other services you'd like to see integrated with PoliMinder, please let us know!
            </p>
             <Image src="https://placehold.co/600x300.png" alt="Integration concept" width={600} height={300} className="rounded-md my-4" data-ai-hint="integration connection" />
        </CardContent>
      </Card>
    </div>
  );
}
