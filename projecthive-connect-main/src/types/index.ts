
export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  dependsOn?: string[]; // IDs of tasks this task depends on
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userDisplayName: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  isRunning: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: "created" | "updated" | "deleted" | "commented" | "tracked";
  entityType: "project" | "task" | "comment" | "time";
  entityId: string;
  details: string;
  timestamp: string;
  userDisplayName: string;
}
