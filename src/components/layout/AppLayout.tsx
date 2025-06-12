import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Calendar, ListChecks, Wrench, Settings, Bot, Zap, FileText, Users } from 'lucide-react';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/services', label: 'Services & Items', icon: Wrench },
  { href: '/ai-tools', label: 'AI Tools', icon: Zap },
  { href: '/integrations', label: 'Integrations', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-sidebar-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-semibold text-sidebar-foreground font-headline">PoliMinder</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    variant="default"
                    size="default"
                    className="w-full justify-start"
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <p className="text-xs text-sidebar-foreground/70">&copy; {new Date().getFullYear()} PoliMinder</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-lg font-semibold text-foreground">Welcome</h2>
          {/* User profile / actions can go here */}
           <Users className="h-6 w-6 text-primary" />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      <ChatbotWidget />
    </SidebarProvider>
  );
}
