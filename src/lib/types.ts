
export interface User {
  uid: string;
  name: string;
  email: string;
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
  source?: 'QuickBooks' | 'Manual' | 'AI-Extraction';
  quickbooksId?: string;
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
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  serviceIds: string[];
  serviceNames: string[];
  isCompleted?: boolean;
  notes?: string;
  createdAt?: any;
  source?: 'AI-Extraction' | 'Manual';
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
  date: Date;
  category: string;
  vendor: string;
  amount: number;
  createdAt?: any;
  source?: 'AI-Extraction' | 'Manual';
}

export interface ChartData {
    name: string;
    total: number;
}
