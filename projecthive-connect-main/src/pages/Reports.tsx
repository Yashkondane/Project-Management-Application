
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Project, Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Sample data (in a real app, this would come from the API)
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    status: "active",
    priority: "high",
    dueDate: "2024-03-15",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "New mobile application for clients",
    progress: 30,
    status: "active",
    priority: "medium",
    dueDate: "2024-04-01",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing initiative",
    progress: 90,
    status: "completed",
    priority: "high",
    dueDate: "2024-02-28",
  },
  {
    id: "4",
    name: "Internal Tool Upgrade",
    description: "Upgrade existing internal tools",
    progress: 15,
    status: "on-hold",
    priority: "low",
    dueDate: "2024-05-10",
  },
];

const sampleTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Design homepage mockups",
    description: "Create initial designs for the new homepage",
    status: "completed",
    priority: "medium",
    dueDate: "2024-03-01",
  },
  {
    id: "2",
    projectId: "1",
    title: "Implement responsive design",
    description: "Make sure the website works on all devices",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-03-10",
  },
  {
    id: "3",
    projectId: "1",
    title: "Content migration",
    description: "Move content from old site to new one",
    status: "todo",
    priority: "medium",
    dueDate: "2024-03-12",
  },
  {
    id: "4",
    projectId: "2",
    title: "UI/UX Design",
    description: "Design user interface for mobile app",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-03-20",
  },
  {
    id: "5",
    projectId: "2",
    title: "API Integration",
    description: "Connect to backend APIs",
    status: "todo",
    priority: "high",
    dueDate: "2024-03-25",
  },
  {
    id: "6",
    projectId: "3",
    title: "Create social media posts",
    description: "Design and schedule posts for campaign",
    status: "completed",
    priority: "medium",
    dueDate: "2024-02-20",
  },
  {
    id: "7",
    projectId: "3",
    title: "Track campaign metrics",
    description: "Monitor performance across channels",
    status: "completed",
    priority: "low",
    dueDate: "2024-02-28",
  },
];

const Reports = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch updated data here
      setIsLoading(false);
      toast.success("Report data refreshed");
    }, 1000);
  };
  
  const handleExportReport = () => {
    toast.success("Report exported to CSV");
    // In a real app, this would generate and download a CSV/PDF
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Track your project and task performance
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project & Task Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard projects={projects} tasks={tasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
