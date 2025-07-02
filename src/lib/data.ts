import { Client, Service, Appointment, Project, Expense, ChartData } from "./types";

export const clients: Client[] = [
  { id: "1", name: "Innovate Inc.", email: "contact@innovate.com", phone: "555-0101", activeProjects: 2 },
  { id: "2", name: "Solutions Co.", email: "hello@solutions.co", phone: "555-0102", activeProjects: 1 },
  { id: "3", name: "Apex Enterprises", email: "support@apex.com", phone: "555-0103", activeProjects: 3 },
  { id: "4", name: "Quantum Group", email: "info@quantum.com", phone: "555-0104", activeProjects: 0 },
];

export const services: Service[] = [
  { id: "1", name: "Consultation Stratégique", description: "Conseils d'experts pour la croissance de l'entreprise.", price: 500.00 },
  { id: "2", name: "Développement Web", description: "Création de sites web réactifs et modernes.", price: 2500.00 },
  { id: "3", name: "Maintenance Mensuelle", description: "Support et mises à jour continus.", price: 150.00 },
];

export const appointments: Appointment[] = [
    { id: "1", client: "Innovate Inc.", service: "Consultation Stratégique", date: "2024-07-25 10:00", assignedTo: "Jessica", status: "Terminé", amount: 500.00 },
    { id: "2", client: "Solutions Co.", service: "Développement Web", date: "2024-07-28 14:00", assignedTo: "Mikael", status: "À venir", amount: 2500.00 },
    { id: "3", client: "Apex Enterprises", service: "Maintenance Mensuelle", date: "2024-07-30 11:00", assignedTo: "Mikael", status: "À venir", amount: 150.00 },
    { id: "4", client: "Innovate Inc.", service: "Consultation Stratégique", date: "2024-08-02 09:00", assignedTo: "Jessica", status: "À venir", amount: 500.00 },
    { id: "5", client: "Quantum Group", service: "Consultation Stratégique", date: "2024-07-20 16:00", assignedTo: "Jessica", status: "Annulé", amount: 500.00 },
];

export const projects: Project[] = [
    { id: "1", name: "Refonte du site web", client: "Innovate Inc.", progress: 75, budget: 10000 },
    { id: "2", name: "Lancement de produit", client: "Solutions Co.", progress: 40, budget: 25000 },
    { id: "3", name: "Campagne Marketing T3", client: "Apex Enterprises", progress: 90, budget: 15000 },
    { id: "4", name: "Mise à niveau de l'infrastructure", client: "Innovate Inc.", progress: 20, budget: 50000 },
];

export const expenses: Expense[] = [
  { id: "1", date: "2024-07-15", category: "Transport", vendor: "Shell", amount: 80.00 },
  { id: "2", date: "2024-07-16", category: "Fournitures de bureau", vendor: "Bureau en Gros", amount: 125.50 },
  { id: "3", date: "2024-07-18", category: "Logiciels", vendor: "Adobe Creative Cloud", amount: 59.99 },
];

export const chartData: ChartData[] = [
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
