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
  client: string;
  service: string;
  date: string;
  assignedTo: "Jessica" | "Mikael";
  status: "À venir" | "Terminé" | "Annulé";
  amount: number;
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
