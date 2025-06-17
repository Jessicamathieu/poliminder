import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Switch } from "@/components/common/switch";
import { Label } from "@/components/common/label";
import { BellDot, UserCheck } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Notification Settings</CardTitle>
          <CardDescription>Manage how you and your clients receive notifications and reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><UserCheck className="mr-2 h-5 w-5 text-accent" /> Client Reminders</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointment-reminders" className="flex-1">
                Appointment Reminders
                <p className="text-xs text-muted-foreground">Send automated reminders to clients before their scheduled appointments.</p>
              </Label>
              <Switch id="appointment-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="review-requests" className="flex-1">
                Satisfaction Review Requests
                <p className="text-xs text-muted-foreground">Automatically send review requests after task/appointment completion.</p>
              </Label>
              <Switch id="review-requests" defaultChecked />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><BellDot className="mr-2 h-5 w-5 text-accent" /> Employee Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-assignments" className="flex-1">
                New Task Assignments
                <p className="text-xs text-muted-foreground">Notify employees when they are assigned a new task.</p>
              </Label>
              <Switch id="task-assignments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders" className="flex-1">
                Task Deadline Reminders
                <p className="text-xs text-muted-foreground">Remind employees of upcoming task deadlines.</p>
              </Label>
              <Switch id="task-reminders" />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="schedule-changes" className="flex-1">
                Schedule Changes
                <p className="text-xs text-muted-foreground">Notify employees of any changes to their schedule.</p>
              </Label>
              <Switch id="schedule-changes" defaultChecked />
            </div>
          </div>
          
          <Image src="https://placehold.co/600x250.png" alt="Notification settings illustration" width={600} height={250} className="rounded-md my-4" data-ai-hint="notifications settings" />

          <Button variant="default" className="w-full sm:w-auto">Save Settings (Placeholder)</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Account Settings</CardTitle>
          <CardDescription>Manage your profile and application preferences.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Further account settings (e.g., profile information, password change, theme preferences) would be available here. This section is a placeholder for future development.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
