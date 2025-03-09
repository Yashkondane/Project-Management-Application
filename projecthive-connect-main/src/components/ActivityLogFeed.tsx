
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLog } from "@/types";
import { formatDistanceToNow } from 'date-fns';
import { FileText, Clock, MessageSquare, Edit, Trash, PlusCircle } from 'lucide-react';

interface ActivityLogFeedProps {
  logs: ActivityLog[];
  title?: string;
}

const ActivityLogFeed: React.FC<ActivityLogFeedProps> = ({
  logs,
  title = "Activity Log"
}) => {
  const getActionColor = (action: ActivityLog["action"]): string => {
    switch (action) {
      case "created":
        return "text-green-500";
      case "updated":
        return "text-blue-500";
      case "deleted":
        return "text-red-500";
      case "commented":
        return "text-amber-500";
      case "tracked":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getEntityIcon = (entityType: ActivityLog["entityType"]) => {
    switch (entityType) {
      case "project":
        return <FileText className="h-4 w-4" />;
      case "task":
        return <Edit className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "time":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getActionIcon = (action: ActivityLog["action"]) => {
    switch (action) {
      case "created":
        return <PlusCircle className="h-4 w-4" />;
      case "updated":
        return <Edit className="h-4 w-4" />;
      case "deleted":
        return <Trash className="h-4 w-4" />;
      case "commented":
        return <MessageSquare className="h-4 w-4" />;
      case "tracked":
        return <Clock className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className={`mt-0.5 rounded-full p-1 ${getActionColor(log.action)} bg-opacity-20`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{log.userDisplayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <p className="text-sm">
                    <span className={getActionColor(log.action)}>
                      {log.action}
                    </span>
                    {" "}
                    <span className="text-muted-foreground">
                      {log.entityType}
                    </span>
                    {": "}
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogFeed;
