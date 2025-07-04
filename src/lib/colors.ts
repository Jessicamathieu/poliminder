// HSL values for use in CSS
const COLORS = {
  dashboard: '231 79% 52%',     // Blue: #2743e3
  clients: '60 100% 50%',       // Yellow: #ffff00
  services: '90 70% 50%',       // Lime Green: #a6e64d
  appointments: '29 97% 57%',   // Orange: #fb9026
  projects: '330 90% 65%',      // Rose Bonbon
  expenses: '262 50% 50%',      // Mauve (plus bleuté)
  admin: '0 72% 51%',           // Rouge
};

export function getPageAccentColor(pathname: string): string {
  if (pathname.startsWith('/clients')) return COLORS.clients;
  if (pathname.startsWith('/services')) return COLORS.services;
  if (pathname.startsWith('/appointments')) return COLORS.appointments;
  if (pathname.startsWith('/projects')) return COLORS.projects;
  if (pathname.startsWith('/expenses')) return COLORS.expenses;
  if (pathname.startsWith('/admin')) return COLORS.admin;
  
  // Default color for dashboard ('/')
  return COLORS.dashboard;
}
