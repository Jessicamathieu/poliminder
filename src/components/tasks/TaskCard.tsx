'use client';

import type { Task } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Edit2, Trash2, MapPin, Phone, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  // Assume client and employee data might be enriched or passed separately
  clientPhone?: string; 
}

export default function TaskCard({ task, onEdit, onDelete, clientPhone }: TaskCardProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-500 hover:bg-gray-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      case 'blocked': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 break-inside-avoid-column">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold">{task.title}</CardTitle>
          <Badge className={`${getStatusColor(task.status)} text-white`}>{task.status.replace('-', ' ')}</Badge>
        </div>
        {task.deadline && (
          <p className="text-xs text-muted-foreground flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" /> Échéance : {format(new Date(task.deadline), 'PP')}
          </p>
        )}
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {task.description && <p className="text-muted-foreground">{task.description}</p>}
        {task.clientName && <p>Client : {task.clientName}</p>}
        {task.assignedToName && <p>Assigné à : {task.assignedToName}</p>}
        {task.location && (
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span>{task.location}</span>
            <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" asChild>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`} target="_blank" rel="noopener noreferrer" aria-label="Navigate to task location">
                <MapPin className="h-4 w-4 text-primary" />
              </a>
            </Button>
          </div>
        )}
        {clientPhone && (
           <Button variant="outline" size="sm" className="mt-1 text-xs" asChild>
             <a href={`tel:${clientPhone}`}>
               <Phone className="mr-1 h-3 w-3" /> Appeler le client
             </a>
           </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
