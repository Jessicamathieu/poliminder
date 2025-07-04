// HSL values for use in CSS
interface AccentColors {
  primary: string;
  foreground: string;
}

const COLORS: { [key: string]: AccentColors } = {
  dashboard:    { primary: '225 100% 55%', foreground: '240 10% 3.9%' }, // Bleu Fluo
  clients:      { primary: '55 100% 50%',  foreground: '240 10% 3.9%' }, // Jaune Fluo
  services:     { primary: '85 100% 48%',  foreground: '240 10% 3.9%' }, // Vert Lime Fluo
  appointments: { primary: '35 100% 55%',  foreground: '240 10% 3.9%' }, // Orange Fluo
  projects:     { primary: '330 100% 55%', foreground: '240 10% 3.9%' }, // Rose Fuchsia Fluo
  expenses:     { primary: '275 100% 55%', foreground: '240 10% 3.9%' }, // Mauve Fluo
  admin:        { primary: '0 100% 58%',   foreground: '240 10% 3.9%' }, // Rouge Fluo
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
