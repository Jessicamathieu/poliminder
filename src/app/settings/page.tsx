import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BellDot, UserCheck } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">Paramètres</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Paramètres de notification</CardTitle>
          <CardDescription>Gérez comment vous et vos clients recevez les notifications et rappels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><UserCheck className="mr-2 h-5 w-5 text-accent" /> Rappels client</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointment-reminders" className="flex-1">
                Rappels de rendez-vous
                <p className="text-xs text-muted-foreground">Envoyer des rappels automatisés avant les rendez-vous programmés.</p>
              </Label>
              <Switch id="appointment-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="review-requests" className="flex-1">
                Demandes d'avis de satisfaction
                <p className="text-xs text-muted-foreground">Envoyer automatiquement une demande d'avis après la réalisation d'une tâche ou d'un rendez-vous.</p>
              </Label>
              <Switch id="review-requests" defaultChecked />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><BellDot className="mr-2 h-5 w-5 text-accent" /> Notifications employés</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-assignments" className="flex-1">
                Nouvelles affectations
                <p className="text-xs text-muted-foreground">Notifier les employés lorsqu'une nouvelle tâche leur est attribuée.</p>
              </Label>
              <Switch id="task-assignments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders" className="flex-1">
                Rappels d'échéance
                <p className="text-xs text-muted-foreground">Rappeler aux employés les échéances à venir.</p>
              </Label>
              <Switch id="task-reminders" />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="schedule-changes" className="flex-1">
                Modifications de planning
                <p className="text-xs text-muted-foreground">Notifier les employés de tout changement dans leur planning.</p>
              </Label>
              <Switch id="schedule-changes" defaultChecked />
            </div>
          </div>
          
          <Image src="https://placehold.co/600x250.png" alt="Notification settings illustration" width={600} height={250} className="rounded-md my-4" data-ai-hint="notifications settings" />

          <Button variant="default" className="w-full sm:w-auto">Enregistrer les paramètres (exemple)</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Paramètres du compte</CardTitle>
          <CardDescription>Gérez votre profil et les préférences de l'application.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                D'autres réglages du compte (profil, mot de passe, thème, etc.) seront disponibles ici. Cette section est un exemple pour développement futur.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
