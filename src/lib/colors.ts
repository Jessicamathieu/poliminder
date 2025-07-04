// HSL values for use in CSS
const COLORS = {
  dashboard: '231 79% 52%',     // Blue: #2743e3
  clients: '60 100% 50%',       // Yellow: #ffff00
  services: '123 76% 42%',      // Green: #0ccc34
  appointments: '29 97% 57%',   // Orange: #fb9026
  projects: '300 100% 50%',     // Pink: #ff00ff
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
