export interface Client {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Employee {
  id: string;
  name: string;
  location?: string;
  skills: string[];
  currentWorkload: number; // e.g., number of active tasks
  availability?: string; // Could be a more complex type or fetched dynamically
}

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  clientId?: string;
  clientName?: string; // Denormalized for display
  employeeId?: string;
  employeeName?: string; // Denormalized for display
  serviceId?: string;
  serviceName?: string; // Denormalized for display
  location?: string; // Address for the appointment
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  deadline?: Date;
  assignedTo?: string; // Employee ID
  assignedToName?: string; // Denormalized for display
  clientId?: string;
  clientName?: string; // Denormalized for display
  location?: string; // Address related to the task
  relatedAppointmentId?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number; // Optional: typical duration
  associatedItemIds?: string[]; // IDs of items used for this service
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number; // Cost of the item if sold, or internal cost
  stock?: number; // Optional: if tracking inventory
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category?: string;
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system_message';
  content: string;
  timestamp: Date;
};
