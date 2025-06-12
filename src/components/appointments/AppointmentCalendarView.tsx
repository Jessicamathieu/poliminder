'use client';

import type { Appointment } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
          />
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Appointments for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'selected date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointmentsOnSelectedDate.length > 0 ? (
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
                  {apt.clientName && <p className="text-sm text-muted-foreground">Client: {apt.clientName}</p>}
                  {apt.location && <p className="text-sm text-muted-foreground">Location: {apt.location}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No appointments for this date.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
