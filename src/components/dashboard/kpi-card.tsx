import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
  animationDelay?: string;
}

export default function KpiCard({ title, value, icon: Icon, trend, trendColor = "text-emerald-500", animationDelay }: KpiCardProps) {
  return (
    <Card 
      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className={cn("text-xs text-muted-foreground", trendColor)}>{trend}</p>}
      </CardContent>
    </Card>
  );
}
