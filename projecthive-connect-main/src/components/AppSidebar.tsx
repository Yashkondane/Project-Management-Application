import {
  Calendar,
  Home,
  List,
  Plus,
  Settings,
  Users,
  BarChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import NotificationCenter from "@/components/NotificationCenter";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Tasks", icon: List, url: "/tasks" },
  { title: "Team", icon: Users, url: "/team" },
  { title: "Reports", icon: BarChart, url: "/reports" },
  { title: "Calendar", icon: Calendar, url: "/calendar" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

// Define notification type that matches what NotificationCenter expects
type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
};

// Sample notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Task Assigned",
    message: "You've been assigned to 'Update API documentation'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Project Deadline Approaching",
    message: "Website Redesign project is due in 2 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Project Status Updated",
    message: "Mobile App Development project is now 'In Progress'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: "success",
  },
];

export function AppSidebar() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  const navigate = useNavigate();

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    toast.success("Notification dismissed");
  };

  const handleCreateProject = () => {
    // Validate project data
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!newProject.dueDate) {
      toast.error("Due date is required");
      return;
    }

    // Generate a unique ID
    const projectId = `project-${Date.now()}`;
    
    // Add this to save the project to the state or context
    const project = {
      id: projectId,
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      status: "active",
      priority: newProject.priority,
      dueDate: newProject.dueDate,
    };
    
    // Here you would save to your projects state/context
    // @ts-expect-error
    sampleProjects.push(project);
    
    // Here you would normally save to Supabase/database
    // For now, show a success message
    toast.success(`Project "${newProject.name}" created successfully!`);
    
    // Close the dialog
    setIsNewProjectDialogOpen(false);
    
    // Reset form
    setNewProject({
      name: "",
      description: "",
      priority: "medium",
      dueDate: ""
    });
    
    // Redirect to project page (you might want to change this)
    navigate(`/projects/${projectId}`);
  };

  return (
    <>
      <Sidebar className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <NotificationCenter
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDismiss={handleDismiss}
              />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="button-hover">
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <button 
                className="w-full rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsNewProjectDialogOpen(true)}
              >
                <Plus className="mr-2 inline-block h-4 w-4" />
                New Project
              </button>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* New Project Dialog */}
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Describe what this project is about" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newProject.priority} 
                  onValueChange={(value) => setNewProject({...newProject, priority: value})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
