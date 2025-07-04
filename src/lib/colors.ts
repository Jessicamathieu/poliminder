// HSL values for use in CSS
interface AccentColors {
  primary: string;
  foreground: string;
}

const COLORS: { [key: string]: AccentColors } = {
  dashboard:    { primary: '231 79% 52%', foreground: '0 0% 98%' },     // Blue, white text
  clients:      { primary: '54 95% 55%', foreground: '240 10% 3.9%' },  // Yellow, black text
  services:     { primary: '90 90% 45%', foreground: '0 0% 98%' },     // Vert Pomme, white text
  appointments: { primary: '35 97% 57%', foreground: '0 0% 98%' },   // Orange Flash, white text
  projects:     { primary: '330 90% 65%', foreground: '0 0% 98%' },      // Rose Bonbon, white text
  expenses:     { primary: '262 50% 50%', foreground: '0 0% 98%' },      // Mauve, white text
  admin:        { primary: '0 72% 51%', foreground: '0 0% 98%' },       // Rouge, white text
};

export function getPageAccentColors(pathname: string): AccentColors {
  if (pathname.startsWith('/clients')) return COLORS.clients;
  if (pathname.startsWith('/services')) return COLORS.services;
  if (pathname.startsWith('/appointments')) return COLORS.appointments;
  if (pathname.startsWith('/projects')) return COLORS.projects;
  if (pathname.startsWith('/expenses')) return COLORS.expenses;
  if (pathname.startsWith('/admin')) return COLORS.admin;
  
  // Default color for dashboard ('/')
  return COLORS.dashboard;
}
