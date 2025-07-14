
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Appointment } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "../ui/skeleton";

interface AppointmentsListProps {
    appointments: Appointment[];
    loading: boolean;
}

export default function AppointmentsList({ appointments, loading }: AppointmentsListProps) {
    const upcomingAppointments = appointments
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 5);

  return (
    <div className="space-y-4">
      {loading ? (
        [...Array(4)].map((_, i) => <AppointmentSkeleton key={i} />)
      ) : upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://placehold.co/36x36.png`} alt="Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>{appointment.clientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{appointment.clientName}</p>
                <p className="text-sm text-muted-foreground">{appointment.serviceNames.join(', ')}</p>
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

const AppointmentSkeleton = () => (
    <div className="flex items-center">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-12 ml-auto" />
    </div>
)
