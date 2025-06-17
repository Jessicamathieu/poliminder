'use client';

import type { Task, Client } from '@/lib/types';
import TaskCard from './TaskCard';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

const TASK_STATUSES: Task['status'][] = ['todo', 'in-progress', 'completed', 'blocked'];

interface SortableTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  clientPhone?: string;
}

function SortableTaskItem({ task, onEdit, onDelete, clientPhone }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4 relative">
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} clientPhone={clientPhone} />
      <button {...attributes} {...listeners} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity group-data-[is-dragging=true]:opacity-100" aria-label="Drag task">
        <GripVertical className="h-5 w-5" />
      </button>
    </div>
  );
}


interface TaskBoardProps {
  initialTasks: Task[];
  clients: Client[]; // For fetching client phone numbers
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

export default function TaskBoard({ initialTasks, clients, onEditTask, onDeleteTask, onTaskStatusChange }: TaskBoardProps) {
  const [tasksByStatus, setTasksByStatus] = useState<Record<Task['status'], Task[]>>({
    todo: [],
    'in-progress': [],
    completed: [],
    blocked: [],
  });

  useEffect(() => {
    const newTasksByStatus: Record<Task['status'], Task[]> = { todo: [], 'in-progress': [], completed: [], blocked: [] };
    initialTasks.forEach(task => {
      if (newTasksByStatus[task.status]) {
        newTasksByStatus[task.status].push(task);
      } else {
        // Handle case where task status might be invalid, though types should prevent this
        newTasksByStatus.todo.push(task); 
      }
    });
    setTasksByStatus(newTasksByStatus);
  }, [initialTasks]);


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id && over?.id) {
      const activeContainer = active.data.current?.sortable.containerId as Task['status'] | undefined;
      const overContainer = over.data.current?.sortable.containerId as Task['status'] | undefined;
      const taskId = active.id as string;
      
      if (activeContainer && overContainer && activeContainer !== overContainer) {
        // Task moved to a different column (status change)
        setTasksByStatus(prev => {
          const newTasks = { ...prev };
          const taskIndex = newTasks[activeContainer].findIndex(t => t.id === taskId);
          if (taskIndex > -1) {
            const [task] = newTasks[activeContainer].splice(taskIndex, 1);
            task.status = overContainer; // Update status locally
            newTasks[overContainer].push(task);
            onTaskStatusChange(taskId, overContainer); // Callback for actual update
          }
          return newTasks;
        });
      } else if (activeContainer) {
        // Task reordered within the same column
        const oldIndex = tasksByStatus[activeContainer].findIndex(t => t.id === active.id);
        const newIndex = tasksByStatus[activeContainer].findIndex(t => t.id === over.id);
        if (oldIndex !== newIndex) {
          setTasksByStatus(prev => ({
            ...prev,
            [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
          }));
          // Optional: API call to save new order if backend supports it
        }
      }
    }
  };
  
  const getClientPhone = (clientId?: string): string | undefined => {
    if (!clientId) return undefined;
    return clients.find(c => c.id === clientId)?.phone;
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TASK_STATUSES.map((status) => (
          <div key={status} className="bg-muted/50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 capitalize text-center text-primary">{status.replace('-', ' ')}</h3>
            <SortableContext items={tasksByStatus[status]?.map(t => t.id) || []} strategy={verticalListSortingStrategy} id={status}>
              <div className="space-y-4 min-h-[200px]">
                {tasksByStatus[status]?.map((task) => (
                  <SortableTaskItem 
                    key={task.id} 
                    task={task} 
                    onEdit={onEditTask} 
                    onDelete={onDeleteTask}
                    clientPhone={getClientPhone(task.clientId)}
                  />
                ))}
                {tasksByStatus[status]?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucune tâche dans ce statut.</p>
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
