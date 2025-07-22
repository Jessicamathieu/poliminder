// HSL values for use in CSS
interface AccentColors {
  primary: string;
  foreground: string;
}

const COLORS: { [key: string]: AccentColors } = {
  dashboard:    { primary: '262 83% 58%', foreground: '0 0% 98%' }, 
  clients:      { primary: '210 100% 55%', foreground: '0 0% 98%' }, 
  services:     { primary: '160 100% 40%', foreground: '0 0% 98%' }, 
  appointments: { primary: '30 100% 55%', foreground: '0 0% 98%' }, 
  projects:     { primary: '330 100% 55%', foreground: '0 0% 98%' }, 
  expenses:     { primary: '290 100% 55%', foreground: '0 0% 98%' },
  admin:        { primary: '0 100% 58%',   foreground: '0 0% 98%' }, 
  default:      { primary: '262 83% 58%', foreground: '0 0% 98%' }
};

export function getPageAccentColors(pathname: string): AccentColors {
  const page = pathname.split('/')[1] || 'dashboard';
  return COLORS[page] || COLORS.default;
}
