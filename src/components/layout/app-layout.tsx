"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import { getPageAccentColor } from '@/lib/colors';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const accentColor = getPageAccentColor(pathname);

  return (
    <SidebarProvider style={{ '--primary': accentColor } as React.CSSProperties}>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-background relative overflow-y-auto">
           <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.05),transparent_35%)]" />
           <div className="animate-fade-in-up">
            {children}
           </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
