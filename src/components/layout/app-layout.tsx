"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-background relative overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
