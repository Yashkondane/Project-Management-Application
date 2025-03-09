
import { Comment } from "@/types";
import { logActivity } from "./activityLogService";

// In a real application, this would interact with your Supabase database
const comments: Comment[] = [];

export const addComment = (
  taskId: string,
  userId: string,
  content: string,
  userDisplayName: string
): Comment => {
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    taskId,
    userId,
    content,
    createdAt: new Date().toISOString(),
    userDisplayName
  };
  
  comments.push(newComment);
  
  // Log this activity
  logActivity(
    userId,
    "commented",
    "task",
    taskId,
    `Comment added: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    userDisplayName
  );
  
  return newComment;
};

export const getCommentsForTask = (taskId: string): Comment[] => {
  return comments
    .filter(comment => comment.taskId === taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateComment = (
  commentId: string,
  content: string,
  userId: string,
  userDisplayName: string
): Comment | null => {
  const commentIndex = comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) return null;
  
  const comment = comments[commentIndex];
  
  // Check if the user is the owner of the comment
  if (comment.userId !== userId) return null;
  
  const updatedComment: Comment = {
    ...comment,
    content,
    updatedAt: new Date().toISOString()
  };
  
  comments[commentIndex] = updatedComment;
  
  // Log this activity
  logActivity(
    userId,
    "updated",
    "comment",
    commentId,
    `Comment updated: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    userDisplayName
  );
  
  return updatedComment;
};

export const deleteComment = (
  commentId: string,
  userId: string,
  userDisplayName: string
): boolean => {
  const commentIndex = comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) return false;
  
  const comment = comments[commentIndex];
  
  // Check if the user is the owner of the comment
  if (comment.userId !== userId) return false;
  
  comments.splice(commentIndex, 1);
  
  // Log this activity
  logActivity(
    userId,
    "deleted",
    "comment",
    commentId,
    `Comment deleted`,
    userDisplayName
  );
  
  return true;
};
