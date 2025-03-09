
import { ActivityLog } from "@/types";

// In a real application, this would interact with your Supabase database
const activityLogs: ActivityLog[] = [];

export const logActivity = (
  userId: string,
  action: ActivityLog["action"],
  entityType: ActivityLog["entityType"],
  entityId: string,
  details: string,
  userDisplayName: string
): ActivityLog => {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}`,
    userId,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString(),
    userDisplayName
  };
  
  activityLogs.unshift(newLog); // Add to beginning of array
  
  // In production, you would save this to Supabase here
  // supabase.from('activity_logs').insert(newLog).then(...)
  
  return newLog;
};

export const getActivityLogs = (
  limit = 50,
  entityType?: ActivityLog["entityType"],
  entityId?: string
): ActivityLog[] => {
  let filteredLogs = [...activityLogs];
  
  if (entityType) {
    filteredLogs = filteredLogs.filter(log => log.entityType === entityType);
  }
  
  if (entityId) {
    filteredLogs = filteredLogs.filter(log => log.entityId === entityId);
  }
  
  return filteredLogs.slice(0, limit);
};

export const getProjectActivityLogs = (projectId: string, limit = 20): ActivityLog[] => {
  return getActivityLogs(limit, "project", projectId);
};

export const getTaskActivityLogs = (taskId: string, limit = 20): ActivityLog[] => {
  return getActivityLogs(limit, "task", taskId);
};
