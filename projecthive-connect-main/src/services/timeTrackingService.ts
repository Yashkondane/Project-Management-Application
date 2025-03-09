
import { TimeEntry } from "@/types";
import { logActivity } from "./activityLogService";

// In a real application, this would interact with your Supabase database
const timeEntries: TimeEntry[] = [];

export const startTimeTracking = (
  taskId: string,
  userId: string,
  description: string,
  userDisplayName: string
): TimeEntry => {
  // First, make sure no other timer is running for this user
  stopRunningTimers(userId);
  
  const newEntry: TimeEntry = {
    id: `time-${Date.now()}`,
    taskId,
    userId,
    description,
    startTime: new Date().toISOString(),
    isRunning: true
  };
  
  timeEntries.push(newEntry);
  
  // Log this activity
  logActivity(
    userId,
    "tracked",
    "time",
    taskId,
    `Started tracking time: ${description}`,
    userDisplayName
  );
  
  return newEntry;
};

export const stopTimeTracking = (
  entryId: string,
  userId: string,
  userDisplayName: string
): TimeEntry | null => {
  const entryIndex = timeEntries.findIndex(e => e.id === entryId && e.isRunning);
  if (entryIndex === -1) return null;
  
  const entry = timeEntries[entryIndex];
  
  // Check if the user is the owner of the time entry
  if (entry.userId !== userId) return null;
  
  const endTime = new Date().toISOString();
  const duration = (new Date(endTime).getTime() - new Date(entry.startTime).getTime()) / 1000; // in seconds
  
  const updatedEntry: TimeEntry = {
    ...entry,
    endTime,
    duration,
    isRunning: false
  };
  
  timeEntries[entryIndex] = updatedEntry;
  
  // Log this activity
  logActivity(
    userId,
    "tracked",
    "time",
    entry.taskId,
    `Stopped tracking time: ${formatDuration(duration)}`,
    userDisplayName
  );
  
  return updatedEntry;
};

export const stopRunningTimers = (userId: string): void => {
  const now = new Date().toISOString();
  
  timeEntries.forEach((entry, index) => {
    if (entry.userId === userId && entry.isRunning) {
      const duration = (new Date(now).getTime() - new Date(entry.startTime).getTime()) / 1000;
      
      timeEntries[index] = {
        ...entry,
        endTime: now,
        duration,
        isRunning: false
      };
    }
  });
};

export const getTimeEntriesForTask = (taskId: string): TimeEntry[] => {
  return timeEntries
    .filter(entry => entry.taskId === taskId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getTimeEntriesForUser = (userId: string): TimeEntry[] => {
  return timeEntries
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getTotalDurationForTask = (taskId: string): number => {
  return timeEntries
    .filter(entry => entry.taskId === taskId && !entry.isRunning)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
};

export const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getRunningTimeEntry = (userId: string): TimeEntry | null => {
  return timeEntries.find(entry => entry.userId === userId && entry.isRunning) || null;
};
