import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, User, MapPin } from 'lucide-react';
import type { Client } from '@/lib/types';

type ClientCardProps = {
  client: Client;
};

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="flex flex-col transition-all duration-200 ease-in-out shadow-md hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex-row items-center gap-4 pb-4">
        <div className="p-3 bg-orange-100 rounded-full">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl font-headline">{client.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-3">
        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">{client.phone}</span>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
          <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
          <span className="text-sm">{client.address}</span>
        </div>
        <div className="mt-auto pt-2">
          <Button asChild className="w-full">
            <a href={`tel:${client.phone}`}>
              <Phone className="mr-2" /> Appeler
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
