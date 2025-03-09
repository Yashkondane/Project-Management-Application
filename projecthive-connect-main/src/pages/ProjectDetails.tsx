
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  MessageSquare, 
  ListChecks,
  ActivityIcon,
  Link2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, Comment, TimeEntry, ActivityLog } from "@/types";
import TaskComments from "@/components/TaskComments";
import TaskTimeTracking from "@/components/TaskTimeTracking";
import ActivityLogFeed from "@/components/ActivityLogFeed";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import services
import { addComment, getCommentsForTask, updateComment, deleteComment } from "@/services/commentService";
import { startTimeTracking, stopTimeTracking, getTimeEntriesForTask, getTotalDurationForTask, getRunningTimeEntry } from "@/services/timeTrackingService";
import { getTaskActivityLogs } from "@/services/activityLogService";

// Mock user data (in a real app, this would come from auth context)
const currentUser = {
  id: "user-1",
  displayName: "John Doe"
};

// Sample project data
const projects = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX",
    progress: 60,
    status: "active",
    priority: "high",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Design new homepage layout",
    description: "Create wireframes and mockups for the new homepage",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    dependsOn: []
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Implement responsive navigation",
    description: "Create mobile-friendly navigation with dropdown menus",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    dependsOn: ["task-1"]
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Create footer components",
    description: "Design and implement new footer with updated links",
    status: "todo",
    priority: "low",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    dependsOn: []
  }
];

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  
  // States for task dependencies
  const [showDependencyDialog, setShowDependencyDialog] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  
  // Get project details
  const project = projects.find(p => p.id === projectId);
  
  useEffect(() => {
    if (selectedTask) {
      // Update available tasks for dependencies (tasks that aren't the current task and don't depend on it)
      const dependencyCandidates = tasks.filter(t => 
        t.id !== selectedTask.id && 
        !hasDependencyLoop(t.id, [selectedTask.id])
      );
      setAvailableTasks(dependencyCandidates);
    }
  }, [selectedTask, tasks]);
  
  // Function to check for dependency loops
  const hasDependencyLoop = (taskId: string, path: string[] = []): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.dependsOn || task.dependsOn.length === 0) return false;
    
    for (const dependencyId of task.dependsOn) {
      if (path.includes(dependencyId)) return true;
      if (hasDependencyLoop(dependencyId, [...path, dependencyId])) return true;
    }
    
    return false;
  };
  
  // Function to add a task dependency
  const addDependency = (taskId: string) => {
    if (!selectedTask) return;
    
    // Check if dependency already exists
    if (selectedTask.dependsOn?.includes(taskId)) {
      toast.error("This dependency already exists");
      return;
    }
    
    // Create updated task with new dependency
    const updatedTask: Task = {
      ...selectedTask,
      dependsOn: [...(selectedTask.dependsOn || []), taskId]
    };
    
    // Update tasks array
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    setShowDependencyDialog(false);
    toast.success("Dependency added successfully");
  };
  
  // Function to remove a task dependency
  const removeDependency = (taskId: string) => {
    if (!selectedTask || !selectedTask.dependsOn) return;
    
    // Create updated task with dependency removed
    const updatedTask: Task = {
      ...selectedTask,
      dependsOn: selectedTask.dependsOn.filter(id => id !== taskId)
    };
    
    // Update tasks array
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    toast.success("Dependency removed");
  };
  
  // Comments functionality
  const [comments, setComments] = useState<Comment[]>([]);
  
  const handleAddComment = (taskId: string, content: string) => {
    const newComment = addComment(
      taskId,
      currentUser.id,
      content,
      currentUser.displayName
    );
    setComments([newComment, ...comments]);
  };
  
  const handleUpdateComment = (commentId: string, content: string) => {
    const updatedComment = updateComment(
      commentId,
      content,
      currentUser.id,
      currentUser.displayName
    );
    if (updatedComment) {
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
    }
  };
  
  const handleDeleteComment = (commentId: string) => {
    const success = deleteComment(
      commentId,
      currentUser.id,
      currentUser.displayName
    );
    if (success) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };
  
  // Time tracking functionality
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [runningEntry, setRunningEntry] = useState<TimeEntry | null>(null);
  const [totalDuration, setTotalDuration] = useState(0);
  
  const handleStartTracking = (taskId: string, description: string) => {
    const newEntry = startTimeTracking(
      taskId,
      currentUser.id,
      description,
      currentUser.displayName
    );
    setRunningEntry(newEntry);
    setTimeEntries([newEntry, ...timeEntries]);
  };
  
  const handleStopTracking = (entryId: string) => {
    const updatedEntry = stopTimeTracking(
      entryId,
      currentUser.id,
      currentUser.displayName
    );
    if (updatedEntry) {
      setRunningEntry(null);
      setTimeEntries(timeEntries.map(e => e.id === entryId ? updatedEntry : e));
      setTotalDuration(prev => prev + (updatedEntry.duration || 0));
    }
  };
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // Load data when a task is selected
  useEffect(() => {
    if (selectedTask) {
      // Load comments
      const taskComments = getCommentsForTask(selectedTask.id);
      setComments(taskComments);
      
      // Load time entries
      const taskTimeEntries = getTimeEntriesForTask(selectedTask.id);
      setTimeEntries(taskTimeEntries);
      
      // Check if there's a running entry
      const running = getRunningTimeEntry(currentUser.id);
      setRunningEntry(running);
      
      // Calculate total duration
      const total = getTotalDurationForTask(selectedTask.id);
      setTotalDuration(total);
      
      // Load activity logs
      const logs = getTaskActivityLogs(selectedTask.id);
      setActivityLogs(logs);
    }
  }, [selectedTask]);
  
  // Get dependent tasks for the selected task
  const getDependentTasks = () => {
    if (!selectedTask || !selectedTask.dependsOn || selectedTask.dependsOn.length === 0) {
      return [];
    }
    
    return tasks.filter(t => selectedTask.dependsOn?.includes(t.id));
  };
  
  // Get the status color class
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-amber-500";
      case "todo":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };
  
  if (!project) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Project not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tasks list */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {tasks
                    .filter(task => task.projectId === projectId)
                    .map(task => (
                      <div 
                        key={task.id}
                        className={`p-4 cursor-pointer hover:bg-accent/50 ${selectedTask?.id === task.id ? 'bg-accent' : ''}`}
                        onClick={() => {
                          setSelectedTask(task);
                          setActiveTab("details");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                          <h3 className="font-medium">{task.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {task.description}
                        </p>
                        {task.dependsOn && task.dependsOn.length > 0 && (
                          <div className="flex items-center mt-2">
                            <Link2 className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {task.dependsOn.length} {task.dependsOn.length === 1 ? 'dependency' : 'dependencies'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Task details and tabs */}
          <div className="md:col-span-2">
            {selectedTask ? (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{selectedTask.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{selectedTask.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium">Status</h4>
                        <div className="flex items-center mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedTask.status)} mr-2`}></div>
                          <span className="capitalize">{selectedTask.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Priority</h4>
                        <span className="capitalize">{selectedTask.priority}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Due Date</h4>
                        <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Dependencies section */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Dependencies</h4>
                        <Dialog open={showDependencyDialog} onOpenChange={setShowDependencyDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3 w-3 mr-1" /> Add Dependency
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Task Dependency</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                              {availableTasks.length > 0 ? (
                                availableTasks.map(task => (
                                  <div 
                                    key={task.id} 
                                    className="p-3 border rounded-md cursor-pointer hover:bg-accent"
                                    onClick={() => addDependency(task.id)}
                                  >
                                    <h3 className="font-medium">{task.title}</h3>
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted-foreground">No available tasks to add as dependencies.</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {getDependentTasks().length > 0 ? (
                        <div className="space-y-2">
                          {getDependentTasks().map(task => (
                            <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`}></div>
                                <span>{task.title}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeDependency(task.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No dependencies added yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">
                      <ListChecks className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comments
                    </TabsTrigger>
                    <TabsTrigger value="timeTracking">
                      <Clock className="h-4 w-4 mr-2" />
                      Time Tracking
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                      <ActivityIcon className="h-4 w-4 mr-2" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">{selectedTask.description}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="comments">
                    <TaskComments 
                      taskId={selectedTask.id}
                      comments={comments}
                      onAddComment={handleAddComment}
                      onUpdateComment={handleUpdateComment}
                      onDeleteComment={handleDeleteComment}
                    />
                  </TabsContent>
                  
                  <TabsContent value="timeTracking">
                    <TaskTimeTracking 
                      taskId={selectedTask.id}
                      timeEntries={timeEntries}
                      runningEntry={runningEntry}
                      totalDuration={totalDuration}
                      onStartTracking={handleStartTracking}
                      onStopTracking={handleStopTracking}
                    />
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <ActivityLogFeed 
                      logs={activityLogs}
                      title="Activity History"
                    />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 border rounded-lg bg-muted/10">
                <h3 className="text-xl font-medium mb-2">Select a task</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Choose a task from the list to view details, add comments, and track time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
