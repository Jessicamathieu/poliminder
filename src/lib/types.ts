export interface User {
  name: string;
  role: "admin" | "field";
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  activeProjects: number;
  createdAt?: any;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt?: any;
}

export interface Appointment {
  id: string;
  start: Date;
  end: Date;
  status: "À venir" | "Terminé" | "Annulé";
  amount?: number;

  // Champs pour le nouvel agenda
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  serviceIds: string[];
  serviceNames: string[];
  isCompleted?: boolean;
  notes?: string;

  // Champs dépréciés, gardés pour compatibilité temporaire
  client: string; 
  service: string;
  assignedTo?: "Jessica" | "Mikael";
}

export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  budget: number;
}

export interface Expense {
  id:string;
  date: string;
  category: string;
  vendor: string;
  amount: number;
}

export interface ChartData {
    name: string;
    total: number;
}

    