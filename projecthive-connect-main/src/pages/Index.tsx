
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
    status: "active",
    priority: "high",
    dueDate: "2024-02-28",
  },
];

const Index = () => {
  const [projects] = useState<Project[]>(sampleProjects);
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-green-100 text-green-800 hover:bg-green-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back! Here's an overview of your projects.
            </p>
          </div>
          <Button
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "This feature will be available soon!",
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card hover:translate-y-[-4px] hover:shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors ${getPriorityColor(
                      project.priority
                    )}`}
                  >
                    {project.priority}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-medium text-gray-700">
                    {project.progress}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full transition-all duration-300 ease-in-out ${getProgressColor(
                      project.progress
                    )}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                <Link to={`/projects/${project.id}`}>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
