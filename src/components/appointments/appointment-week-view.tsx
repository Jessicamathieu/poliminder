"use client";

import { Appointment } from "@/lib/types";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfHour,
  startOfWeek,
  isToday,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AppointmentWeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
}

const AppointmentWeekView = ({ currentDate, appointments }: AppointmentWeekViewProps) => {
  const weekStart = startOfWeek(currentDate, { locale: fr });
  const weekEnd = endOfWeek(currentDate, { locale: fr });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getAppointmentPositionAndHeight = (appointment: Appointment) => {
    const startHour = getHours(appointment.start);
    const startMinute = getMinutes(appointment.start);
    const top = (startHour - 8) * 60 + startMinute; // top in minutes from 8am

    const duration = differenceInMinutes(appointment.end, appointment.start);
    
    // Assuming 1 minute = 1px for simplicity in this view
    return { top: top, height: duration };
  };

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 grid grid-cols-[auto,1fr] bg-background">
        {/* Corner */}
        <div className="w-16 border-r border-b">&nbsp;</div> 
        {/* Day Headers */}
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <div key={day.toString()} className="p-2 text-center border-b border-r">
              <p className="text-xs text-muted-foreground">{format(day, "eee", { locale: fr })}</p>
              <p className={cn("text-2xl font-semibold", isToday(day) && "text-primary")}>
                {format(day, "d")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto,1fr] flex-1">
        {/* Time Gutter */}
        <div className="w-16">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] text-right pr-2 pt-[-10px] text-xs text-muted-foreground border-r relative">
              <span className="absolute -top-2 right-2">{format(startOfHour(new Date().setHours(hour)), "ha", { locale: fr })}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 relative">
          {/* Vertical Lines */}
          {days.slice(0, 6).map((_, index) => (
             <div key={index} className="absolute h-full w-px bg-border" style={{ left: `calc(${(index + 1) * 100 / 7}%)` }} />
          ))}
          {/* Horizontal Lines */}
          {hours.slice(0, 12).map((_, index) => (
            <div key={index} className="absolute w-full h-px bg-border" style={{ top: `${(index + 1) * 60}px` }} />
          ))}

          {days.map((day) => (
            <div key={day.toISOString()} className="relative">
              {appointments
                .filter((appt) => isSameDay(appt.start, day))
                .map((appointment) => {
                  const { top, height } = getAppointmentPositionAndHeight(appointment);
                  return (
                    <div
                      key={appointment.id}
                      className="absolute w-[95%] left-1 rounded-lg p-2 text-xs bg-primary/20 border-l-4 border-primary text-primary-foreground transition-all hover:shadow-lg hover:bg-primary/30"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <p className="font-bold text-primary">{appointment.clientName}</p>
                      <p className="text-primary/80">{appointment.serviceNames.join(", ")}</p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentWeekView;
