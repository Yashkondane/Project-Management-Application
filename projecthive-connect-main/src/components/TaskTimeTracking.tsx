
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry } from "@/types";
import { formatDistanceToNow, format } from 'date-fns';
import { Play, Pause, Clock, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { formatDuration } from "@/services/timeTrackingService";

interface TaskTimeTrackingProps {
  taskId: string;
  timeEntries: TimeEntry[];
  runningEntry: TimeEntry | null;
  totalDuration: number;
  onStartTracking: (taskId: string, description: string) => void;
  onStopTracking: (entryId: string) => void;
}

const TaskTimeTracking: React.FC<TaskTimeTrackingProps> = ({
  taskId,
  timeEntries,
  runningEntry,
  totalDuration,
  onStartTracking,
  onStopTracking
}) => {
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Timer logic for running entry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (runningEntry && runningEntry.taskId === taskId) {
      // Calculate initial elapsed time
      const startTime = new Date(runningEntry.startTime).getTime();
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(initialElapsed);
      
      // Set up interval to update elapsed time
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [runningEntry, taskId]);
  
  const handleStartTracking = () => {
    if (description.trim()) {
      onStartTracking(taskId, description);
      setDescription('');
      toast.success('Time tracking started');
    } else {
      toast.error('Please enter a description');
    }
  };
  
  const handleStopTracking = () => {
    if (runningEntry) {
      onStopTracking(runningEntry.id);
      toast.success('Time tracking stopped');
    }
  };
  
  const isTrackingThisTask = runningEntry && runningEntry.taskId === taskId;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Total Time:</h4>
            <span className="text-lg">{formatDuration(totalDuration + (isTrackingThisTask ? elapsedTime : 0))}</span>
          </div>
          
          {isTrackingThisTask ? (
            <div className="bg-primary/10 p-3 rounded-md border border-primary/20 mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Currently tracking:</p>
                  <p className="text-sm">{runningEntry.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg">{formatDuration(elapsedTime)}</p>
                  <p className="text-xs text-muted-foreground">
                    Started {formatDistanceToNow(new Date(runningEntry.startTime), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-2 w-full"
                onClick={handleStopTracking}
              >
                <Pause className="h-4 w-4 mr-2" /> Stop Tracking
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 mb-4">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                className="flex-1"
              />
              <Button onClick={handleStartTracking}>
                <Play className="h-4 w-4 mr-1" /> Start
              </Button>
            </div>
          )}
        </div>
        
        <h4 className="font-medium mb-2">Time Entries</h4>
        {timeEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No time entries yet</p>
        ) : (
          <div className="space-y-2">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.startTime), 'MMM d, yyyy h:mm a')}
                    {entry.endTime && ` - ${format(new Date(entry.endTime), 'h:mm a')}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{entry.duration ? formatDuration(entry.duration) : '--:--:--'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskTimeTracking;
