
import { Client, Service, Appointment, Project, Expense, ChartData } from "./types";

export const clients: Client[] = [
  { id: "1", name: "Innovate Inc.", email: "contact@innovate.com", phone: "555-0101", address: "123 Rue de l'Innovation, Montréal", activeProjects: 2 },
  { id: "2", name: "Solutions Co.", email: "hello@solutions.co", phone: "555-0102", address: "456 Avenue des Affaires, Laval", activeProjects: 1 },
  { id: "3", name: "Apex Enterprises", email: "support@apex.com", phone: "555-0103", address: "789 Boulevard du Succès, Québec", activeProjects: 3 },
  { id: "4", name: "Quantum Group", email: "info@quantum.com", phone: "555-0104", address: "101 Place du Futur, Longueuil", activeProjects: 0 },
];

export const services: Service[] = [
  { id: "1", name: "Consultation Stratégique", description: "Conseils d'experts pour la croissance de l'entreprise.", price: 500.00 },
  { id: "2", name: "Développement Web", description: "Création de sites web réactifs et modernes.", price: 2500.00 },
  { id: "3", name: "Maintenance Mensuelle", description: "Support et mises à jour continus.", price: 150.00 },
];

export const generateChartData = (): ChartData[] => [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Fév", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Avr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mai", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Juin", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Juil", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Août", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Déc", total: Math.floor(Math.random() * 5000) + 1000 },
];
