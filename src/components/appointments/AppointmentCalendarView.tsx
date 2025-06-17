
'use client';

import type { Appointment } from '@/lib/types';
import { Calendar } from '@/components/common/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { useState, useMemo, useEffect } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  onAppointmentSelect?: (appointment: Appointment) => void;
}

export default function AppointmentCalendarView({
  appointments,
  onDateSelect,
  onAppointmentSelect,
}: AppointmentCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Set initial date only on the client side after hydration
    setSelectedDate(new Date());
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const appointmentsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((apt) => isSameDay(parseISO(apt.start.toString()), selectedDate));
  }, [appointments, selectedDate]);

  const eventDays = useMemo(() => {
    return appointments.map(apt => parseISO(apt.start.toString()));
  }, [appointments]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="p-4 w-full"
            modifiers={{ event: eventDays }}
            modifiersClassNames={{ event: 'bg-accent/30 rounded-full' }}
            initialFocus
          />
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Rendez-vous du {selectedDate ? format(selectedDate, 'd MMMM yyyy') : 'chargement...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate && appointmentsOnSelectedDate.length > 0 ? (
            <ul className="space-y-3">
              {appointmentsOnSelectedDate.map((apt) => (
                <li
                  key={apt.id}
                  className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => onAppointmentSelect && onAppointmentSelect(apt)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{apt.title}</h4>
                    <Badge variant={apt.status === 'completed' ? 'default' : apt.status === 'cancelled' ? 'destructive' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(apt.start.toString()), 'p')} - {format(parseISO(apt.end.toString()), 'p')}
                  </p>
                  {apt.clientName && <p className="text-sm text-muted-foreground">Client : {apt.clientName}</p>}
                  {apt.location && <p className="text-sm text-muted-foreground">Lieu : {apt.location}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {selectedDate ? 'Aucun rendez-vous pour cette date.' : 'Sélectionnez une date pour voir les rendez-vous.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
