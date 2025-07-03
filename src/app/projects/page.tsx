"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
        if (!user) {
            router.push("/login");
        } else if (user.role !== 'admin') {
            router.push('/');
        }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="flex h-screen items-center justify-center">Loading or redirecting...</div>;
  }

  return (
    <AppLayout>
      <>
        <div 
          className="absolute inset-x-0 top-0 z-0 h-64 w-full"
          style={{
              background: 'hsl(var(--primary) / 0.05)',
              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)'
          }}
        />
        <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Projets</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Liste des Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Projet</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-[60%]" />
                          <span>{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${project.budget.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </>
    </AppLayout>
  );
}
