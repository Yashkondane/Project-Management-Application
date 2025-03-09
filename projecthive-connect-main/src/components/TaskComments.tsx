
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Comment } from "@/types";
import { formatDistanceToNow } from 'date-fns';
import { Send, Edit2, Trash2 } from 'lucide-react';
import { toast } from "sonner";

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (taskId: string, content: string) => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment('');
      toast.success('Comment added');
    }
  };
  
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };
  
  const saveEdit = (commentId: string) => {
    if (editContent.trim()) {
      onUpdateComment(commentId, editContent);
      setEditingId(null);
      toast.success('Comment updated');
    }
  };
  
  const cancelEdit = () => {
    setEditingId(null);
  };
  
  const handleDelete = (commentId: string) => {
    onDeleteComment(commentId);
    toast.success('Comment deleted');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4 mr-1" /> Send
          </Button>
        </form>
        
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{comment.userDisplayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    {comment.updatedAt && ' (edited)'}
                  </div>
                </div>
                
                {editingId === comment.id ? (
                  <div className="mt-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(comment.id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    <div className="flex gap-2 justify-end mt-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing(comment)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskComments;
