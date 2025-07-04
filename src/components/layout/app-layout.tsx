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
        <main className="flex-1 bg-background relative overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
