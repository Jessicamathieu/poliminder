
'use client';

import type { Task, Client, Employee } from '@/lib/types';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';
import type { TaskFormData } from '@/components/tasks/TaskFormDialog';
import { Button } from '@/components/common/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';


const getInitialTasksData = (): Task[] => {
  const baseToday = new Date();

  const createDateWithDayOffset = (base: Date, dayOffset: number, hour: number = 17, minute: number = 0): Date => {
    const newDate = new Date(base);
    newDate.setDate(base.getDate() + dayOffset);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  return [
    {
      id: 't1',
      title: 'Prepare equipment for Client A',
      description: 'Ensure all cleaning supplies and machinery are ready.',
      status: 'todo',
      deadline: createDateWithDayOffset(baseToday, 1), // Tomorrow
      assignedTo: 'e1',
      assignedToName: 'Alice Smith',
      clientId: 'c1',
      clientName: 'John Doe',
      location: 'Warehouse',
    },
    {
      id: 't2',
      title: 'Service Client B - Window Washing',
      description: 'Perform window washing service at client location.',
      status: 'in-progress',
      deadline: createDateWithDayOffset(baseToday, 0), // Today
      assignedTo: 'e2',
      assignedToName: 'Bob Johnson',
      clientId: 'c2',
      clientName: 'Jane Roe',
      location: '456 Oak Ave, Anytown, USA',
    },
    {
      id: 't3',
      title: 'Follow up with Client C inquiry',
      description: 'Call Client C regarding their quote request.',
      status: 'todo',
      assignedTo: 'e1',
      assignedToName: 'Alice Smith',
      clientId: 'c3', 
      clientName: 'Charlie Brown',
    },
    {
      id: 't4',
      title: 'Order new cleaning solution',
      description: 'Stock is low, need to reorder PowerClean X.',
      status: 'blocked',
      deadline: createDateWithDayOffset(baseToday, 5), // 5 days from now
      location: 'Office',
    },
    {
      id: 't5',
      title: 'Finalize Q3 Report',
      description: 'Complete the quarterly performance report.',
      status: 'completed',
      assignedTo: 'e1',
      assignedToName: 'Alice Smith',
    },
  ];
};


const dummyClients: Client[] = [
  { id: 'c1', name: 'John Doe', phone: '555-1234', email: 'john@example.com', address: '123 Main St, Anytown, USA' },
  { id: 'c2', name: 'Jane Roe', phone: '555-5678', email: 'jane@example.com', address: '456 Oak Ave, Anytown, USA' },
  { id: 'c3', name: 'Charlie Brown', phone: '555-8765', email: 'charlie@example.com', address: '789 Pine Ln, Anytown, USA' },
];
const dummyEmployees: Employee[] = [
  { id: 'e1', name: 'Alice Smith', skills: ['cleaning', 'driving'], currentWorkload: 2 },
  { id: 'e2', name: 'Bob Johnson', skills: ['window_washing', 'gardening'], currentWorkload: 1 },
];


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setTasks(getInitialTasksData());
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setSelectedTask(undefined);
      setIsFormOpen(true);
    }
  }, [searchParams]);


  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleSubmitTask = useCallback(async (data: TaskFormData) => {
    console.log('Submitting task data:', data);
    const client = dummyClients.find(c => c.id === data.clientId);
    const employee = dummyEmployees.find(e => e.id === data.assignedTo);

    // Create an object that conforms to the Task structure
    const taskDetails: Omit<Task, 'id' | 'relatedAppointmentId'> & { relatedAppointmentId?: string } = {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      status: data.status,
      assignedTo: data.assignedTo,
      assignedToName: employee?.name,
      clientId: data.clientId,
      clientName: client?.name,
      location: data.location,
    };


    if (selectedTask) {
      setTasks(prevTasks => 
        prevTasks.map((task) => 
          task.id === selectedTask.id 
            ? { ...selectedTask, ...taskDetails, id: selectedTask.id } 
            : task
        )
      );
    } else {
      setTasks(prevTasks => [
        ...prevTasks, 
        { ...taskDetails, id: String(Date.now()) } as Task,
      ]);
    }
  }, [selectedTask]);

  const handleTaskStatusChange = useCallback((taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    console.log(`Task ${taskId} status changed to ${newStatus}`);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary font-headline">Suivi des tâches</h1>
        <Button onClick={handleAddTask} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Nouvelle tâche
        </Button>
      </div>

      <TaskBoard 
        initialTasks={tasks} 
        clients={dummyClients}
        onEditTask={handleEditTask} 
        onDeleteTask={handleDeleteTask} 
        onTaskStatusChange={handleTaskStatusChange}
      />

      {isFormOpen && (
        <TaskFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitTask}
          task={selectedTask}
          clients={dummyClients}
          employees={dummyEmployees}
        />
      )}
    </div>
  );
}
