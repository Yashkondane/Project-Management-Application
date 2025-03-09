
import { ActivityLog, Notification } from "@/types";
import { toast } from "sonner";

// In a real application, this would interact with your Supabase database
// and an email sending service via Supabase Edge Functions
const notifications: Notification[] = [];

// Map activity types to notification types
const activityToNotificationType = (action: ActivityLog["action"]): Notification["type"] => {
  switch (action) {
    case "created":
      return "success";
    case "updated":
      return "info";
    case "deleted":
      return "warning";
    case "commented":
      return "info";
    case "tracked":
      return "info";
    default:
      return "info";
  }
};

// Create notification from activity
export const createNotificationFromActivity = (activity: ActivityLog): Notification => {
  const notification: Notification = {
    id: `notification-${Date.now()}`,
    title: `${activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} ${activity.entityType}`,
    message: activity.details,
    timestamp: new Date(),
    read: false,
    type: activityToNotificationType(activity.action)
  };
  
  notifications.push(notification);
  return notification;
};

// Send email notification
export const sendEmailNotification = async (
  recipient: string,
  subject: string,
  body: string
): Promise<boolean> => {
  // In a real application, this would call a Supabase Edge Function to send an email
  console.log(`Sending email to ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate success
  return true;
};

// Send notification for a task update
export const notifyTaskUpdate = (
  taskTitle: string,
  updateType: string,
  recipients: string[],
  details: string
): void => {
  // Show toast notification
  toast.info(`${taskTitle} ${updateType}`);
  
  // Send email to each recipient
  recipients.forEach(recipient => {
    sendEmailNotification(
      recipient,
      `Task ${updateType}: ${taskTitle}`,
      details
    );
  });
};

// Send notification for a new comment
export const notifyNewComment = (
  taskTitle: string,
  commenter: string,
  recipients: string[],
  commentPreview: string
): void => {
  // Show toast notification
  toast.info(`New comment on ${taskTitle} by ${commenter}`);
  
  // Send email to each recipient
  recipients.forEach(recipient => {
    sendEmailNotification(
      recipient,
      `New comment on ${taskTitle}`,
      `${commenter} commented: ${commentPreview}`
    );
  });
};

// Get all notifications
export const getNotifications = (): Notification[] => {
  return [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (): void => {
  notifications.forEach(notification => {
    notification.read = true;
  });
};
