"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FolderKanban,
  Wallet,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const adminNavItems = [
  { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/appointments", label: "Rendez-vous", icon: Calendar },
  { href: "/projects", label: "Projets", icon: FolderKanban },
  { href: "/expenses", label: "Dépenses", icon: Wallet },
  { href: "/admin", label: "Admin", icon: Settings },
];

const fieldNavItems = [
  { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/appointments", label: "Rendez-vous", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navItems = user?.role === "admin" ? adminNavItems : fieldNavItems;

  return (
    <SidebarUI className="border-r" variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center gap-2 p-4">
        <Shield className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold font-headline">PoliMindeR</span>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="w-4 h-4" />
          <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
        </Button>
      </SidebarFooter>
    </SidebarUI>
  );
}
