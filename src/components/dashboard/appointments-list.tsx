import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { appointments } from "@/lib/data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AppointmentsList() {
    const upcomingAppointments = appointments
        .filter(a => a.status === 'À venir')
        .slice(0, 5);

  return (
    <div className="space-y-4">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://placehold.co/36x36.png`} alt="Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>{appointment.client.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{appointment.client}</p>
                <p className="text-sm text-muted-foreground">{appointment.service}</p>
            </div>
            <div className="ml-auto font-medium">
              {appointment.start ? format(appointment.start, 'HH:mm', { locale: fr }) : 'Date inconnue'}
            </div>
            </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Aucun rendez-vous à venir.
        </p>
      )}
    </div>
  );
}
