// HSL values for use in CSS
const COLORS = {
  dashboard: '262 83% 58%',     // Purple
  clients: '221 83% 53%',       // Blue
  services: '142 76% 36%',      // Green
  appointments: '35 92% 51%',   // Orange
  projects: '173 90% 36%',      // Teal
  expenses: '0 72% 51%',        // Red
  admin: '240 5% 65%',          // Gray
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
