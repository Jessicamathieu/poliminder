
'use client';

import type { Appointment, Client, Employee, Service } from '@/lib/types';
import AppointmentCalendarView from '@/components/appointments/AppointmentCalendarView';
import AppointmentFormDialog from '@/components/appointments/AppointmentFormDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

// Dummy data - replace with actual data fetching and state management
const initialAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Exterior Cleaning - John Doe',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 2)),
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
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 1)),
    clientId: 'c2',
    clientName: 'Jane Roe',
    employeeId: 'e2',
    employeeName: 'Bob Johnson',
    serviceId: 's2',
    serviceName: 'Window Washing',
    location: '456 Oak Ave, Anytown, USA',
    status: 'confirmed',
  },
];

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
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  
  const searchParams = useSearchParams();

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

  const handleSubmitAppointment = useCallback(async (data: any) => {
    // In a real app, this would be an API call
    console.log('Submitting appointment data:', data);
    if (selectedAppointment) {
      setAppointments(prevAppointments => prevAppointments.map((apt) => (apt.id === selectedAppointment.id ? { ...selectedAppointment, ...data, id: selectedAppointment.id } : apt)));
    } else {
      setAppointments(prevAppointments => [...prevAppointments, { ...data, id: String(Date.now()) }]);
    }
  }, [selectedAppointment, setAppointments]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary font-headline">Appointment Calendar</h1>
        <Button onClick={handleAddAppointment} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> New Appointment
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
