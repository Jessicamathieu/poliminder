
'use client';

import type { Appointment, Client, Employee, Service } from '@/lib/types';
import AppointmentCalendarView from '@/components/appointments/AppointmentCalendarView';
import AppointmentFormDialog from '@/components/appointments/AppointmentFormDialog';
import type { AppointmentFormData } from '@/components/appointments/AppointmentFormDialog';
import { Button } from '@/components/common/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const getInitialAppointments = (): Appointment[] => {
  const baseToday = new Date();

  const createDate = (base: Date, dayOffset: number, hour: number, minute: number = 0): Date => {
    const newDate = new Date(base);
    newDate.setDate(base.getDate() + dayOffset);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  return [
    {
      id: '1',
      title: 'Exterior Cleaning - John Doe',
      start: createDate(baseToday, 1, 10), // Tomorrow 10:00 AM
      end: createDate(baseToday, 1, 12),   // Tomorrow 12:00 PM
      clientId: 'c1',
      clientName: 'John Doe',
      employeeId: 'e1',
      employeeName: 'Alice Smith',
      serviceId: 's1',
      serviceName: 'Exterior Cleaning',
      location: '123 Main St, Anytown, USA',
      notes: 'Focus on the north side.',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Window Washing - Jane Roe',
      start: createDate(baseToday, 2, 14), // Day after tomorrow 2:00 PM
      end: createDate(baseToday, 2, 15),   // Day after tomorrow 3:00 PM
      clientId: 'c2',
      clientName: 'Jane Roe',
      employeeId: 'e2',
      employeeName: 'Bob Johnson',
      serviceId: 's2',
      serviceName: 'Window Washing',
      location: '456 Oak Ave, Anytown, USA',
      status: 'confirmed',
    },
    {
      id: '3',
      title: 'Window Washing - John Doe',
      start: createDate(baseToday, 0, 9), // Today 9:00 AM
      end: createDate(baseToday, 0, 11),  // Today 11:00 AM
      clientId: 'c1',
      clientName: 'John Doe',
      employeeId: 'e2',
      employeeName: 'Bob Johnson',
      serviceId: 's2',
      serviceName: 'Window Washing',
      location: '123 Main St, Anytown, USA',
      notes: 'Check front windows first.',
      status: 'scheduled',
    },
    {
      id: '4',
      title: 'Exterior Cleaning - Jane Roe',
      start: createDate(baseToday, 3, 11), // In 3 days 11:00 AM
      end: createDate(baseToday, 3, 13),   // In 3 days 1:00 PM
      clientId: 'c2',
      clientName: 'Jane Roe',
      employeeId: 'e1',
      employeeName: 'Alice Smith',
      serviceId: 's1',
      serviceName: 'Exterior Cleaning',
      location: '456 Oak Ave, Anytown, USA',
      status: 'scheduled',
    },
    {
      id: '5',
      title: 'Window Washing - John Doe',
      start: createDate(baseToday, 4, 15),    // In 4 days 3:00 PM
      end: createDate(baseToday, 4, 16, 30), // In 4 days 4:30 PM
      clientId: 'c1',
      clientName: 'John Doe',
      employeeId: 'e1',
      employeeName: 'Alice Smith',
      serviceId: 's2',
      serviceName: 'Window Washing',
      location: '123 Main St, Anytown, USA',
      status: 'confirmed',
    },
  ];
};


const dummyClients: Client[] = [
  { id: 'c1', name: 'John Doe', phone: '555-1234', email: 'john@example.com', address: '123 Main St, Anytown, USA' },
  { id: 'c2', name: 'Jane Roe', phone: '555-5678', email: 'jane@example.com', address: '456 Oak Ave, Anytown, USA' },
];
const dummyEmployees: Employee[] = [
  { id: 'e1', name: 'Alice Smith', skills: ['cleaning', 'driving'], currentWorkload: 2 },
  { id: 'e2', name: 'Bob Johnson', skills: ['window_washing', 'gardening'], currentWorkload: 1 },
];
const dummyServices: Service[] = [
  { id: 's1', name: 'Exterior Cleaning', price: 150 },
  { id: 's2', name: 'Window Washing', price: 80 },
];


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setAppointments(getInitialAppointments());
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setSelectedAppointment(undefined);
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const handleAddAppointment = () => {
    setSelectedAppointment(undefined);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleSubmitAppointment = useCallback(async (data: AppointmentFormData) => {
    console.log('Submitting appointment data:', data);

    const client = dummyClients.find(c => c.id === data.clientId);
    const employee = dummyEmployees.find(e => e.id === data.employeeId);
    const service = dummyServices.find(s => s.id === data.serviceId);

    // Create an object that conforms to the Appointment structure, minus the id for new appointments
    const appointmentDetails: Omit<Appointment, 'id'> = {
      title: data.title,
      start: data.start,
      end: data.end,
      clientId: data.clientId,
      clientName: client?.name,
      employeeId: data.employeeId,
      employeeName: employee?.name,
      serviceId: data.serviceId,
      serviceName: service?.name,
      location: data.location,
      notes: data.notes,
      status: data.status,
    };

    if (selectedAppointment) {
      setAppointments(prevAppointments => 
        prevAppointments.map((apt) => 
          apt.id === selectedAppointment.id 
            ? { ...selectedAppointment, ...appointmentDetails, id: selectedAppointment.id } 
            : apt
        )
      );
    } else {
      setAppointments(prevAppointments => [
        ...prevAppointments, 
        { ...appointmentDetails, id: String(Date.now()) } as Appointment,
      ]);
    }
  }, [selectedAppointment]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary font-headline">Calendrier des rendez-vous</h1>
        <Button onClick={handleAddAppointment} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Nouveau rendez-vous
        </Button>
      </div>

      <AppointmentCalendarView
        appointments={appointments}
        onAppointmentSelect={handleEditAppointment}
      />

      {isFormOpen && (
        <AppointmentFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitAppointment}
          appointment={selectedAppointment}
          clients={dummyClients}
          employees={dummyEmployees}
          services={dummyServices}
        />
      )}
    </div>
  );
}
