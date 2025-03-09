
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "@/types";
import { 
  Check, 
  Clock, 
  List, 
  Plus, 
  Calendar, 
  X
} from "lucide-react";
import { toast } from "sonner";

// Sample tasks data for demonstration
const initialTasks: Task[] = [
  {
    id: "1",
    projectId: "project-1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard layout",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
  },
  {
    id: "2",
    projectId: "project-1",
    title: "Implement user authentication",
    description: "Set up user login and registration functionality",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  },
  {
    id: "3",
    projectId: "project-2",
    title: "Create API documentation",
    description: "Document all API endpoints and parameters",
    status: "completed",
    priority: "low",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: "project-1", // Default project ID
      title: newTaskTitle,
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    toast.success("Task added successfully");
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus } 
        : task
    ));
    toast.success("Task status updated");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted");
  };

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <List className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-300 bg-red-50";
      case "medium":
        return "text-amber-500 border-amber-300 bg-amber-50";
      case "low":
        return "text-green-500 border-green-300 bg-green-50";
      default:
        return "text-gray-500 border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tasks</h1>
        
        {/* Task filters */}
        <div className="flex mb-6 gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "todo" ? "default" : "outline"} 
            onClick={() => setFilter("todo")}
          >
            To Do
          </Button>
          <Button 
            variant={filter === "in-progress" ? "default" : "outline"} 
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"} 
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
        
        {/* Add new task */}
        <div className="flex gap-2 mb-6">
          <Input 
            placeholder="Add a new task..." 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
        
        {/* Task list */}
        <div className="space-y-3">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))
          ) : filteredTasks.length > 0 ? (
            // Task items
            filteredTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                )}
                
                <div className="flex justify-between mt-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    
                    <select 
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Task["status"])}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-center py-10">
              <List className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No tasks found</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "You haven't created any tasks yet." 
                  : `You don't have any ${filter} tasks.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
