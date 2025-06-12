import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ListTodo, PlusCircle, MessageSquareHeart, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dummy data for appointments - replace with actual data fetching
const upcomingAppointments = [
  { id: "1", title: "Client A - Exterior Cleaning", time: "10:00 AM", date: "Today" },
  { id: "2", title: "Client B - Window Washing", time: "02:00 PM", date: "Today" },
  { id: "3", title: "Client C - Full Package", time: "09:00 AM", date: "Tomorrow" },
];

// Dummy data for tasks - replace with actual data fetching
const openTasks = [
  { id: "t1", title: "Prepare equipment for Client A", deadline: "Today, EOD" },
  { id: "t2", title: "Follow up with Client D inquiry", deadline: "Tomorrow" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <ul className="space-y-2">
                {upcomingAppointments.map((apt) => (
                  <li key={apt.id} className="text-sm p-2 border-b last:border-b-0">
                    <p className="font-semibold">{apt.title}</p>
                    <p className="text-muted-foreground">{apt.date} at {apt.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/appointments">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Open Tasks</CardTitle>
            <ListTodo className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {openTasks.length > 0 ? (
              <ul className="space-y-2">
                {openTasks.map((task) => (
                  <li key={task.id} className="text-sm p-2 border-b last:border-b-0">
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-muted-foreground">Deadline: {task.deadline}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No open tasks.</p>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/tasks">Manage Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <PlusCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/appointments?action=new">New Appointment</Link>
            </Button>
            <Button variant="default" className="w-full" asChild>
              <Link href="/tasks?action=new">New Task</Link>
            </Button>
            <Button variant="outline" className="w-full col-span-2" asChild>
              <Link href="/services">Manage Services</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <MessageSquareHeart className="h-5 w-5 text-accent" />
              Boost Your Reviews!
            </CardTitle>
            <CardDescription>
              Easily send satisfaction review requests to your clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x300.png" alt="Customer review illustration" width={600} height={300} className="rounded-md mb-4" data-ai-hint="customer review marketing" />
            <p className="text-sm mb-4">
              After completing a service, send a personalized thank you message and a direct link to your Google Reviews page to encourage feedback.
            </p>
            <Button variant="accent" className="w-full" asChild>
              <Link href="/ai-tools#satisfaction-review">Send Review Request</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Zap className="h-5 w-5 text-accent" />
              AI-Powered Efficiency
            </CardTitle>
            <CardDescription>
              Leverage AI for smarter scheduling and task assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x300.png" alt="AI assistant illustration" width={600} height={300} className="rounded-md mb-4" data-ai-hint="artificial intelligence technology" />
            <p className="text-sm mb-4">
              Our intelligent tools help you optimize schedules, assign tasks effectively, and provide instant customer support through our AI chatbot.
            </p>
            <Button variant="accent" className="w-full" asChild>
              <Link href="/ai-tools">Explore AI Tools</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
