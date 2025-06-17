import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';
import { Inter } from 'next/font/google';
import { I18nProvider } from '@/i18n/I18nProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PoliMinder',
  description: 'Field Service Management App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <head>
        {/* Les balises link pour Google Fonts ont été supprimées et remplacées par next/font */}
      </head>
      <body className="font-body antialiased">
        <I18nProvider locale="fr">
          <AppLayout>{children}</AppLayout>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  );
}
