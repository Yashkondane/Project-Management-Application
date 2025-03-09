import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task } from "@/types";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    status: "active",
    priority: "high",
    dueDate: "2024-06-15",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "New mobile application for clients",
    progress: 30,
    status: "active",
    priority: "medium",
    dueDate: "2024-07-01",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q2 marketing initiative",
    progress: 90,
    status: "completed",
    priority: "high",
    dueDate: "2024-05-28",
  },
  {
    id: "4",
    name: "Internal Tool Upgrade",
    description: "Upgrade existing internal tools",
    progress: 15,
    status: "on-hold",
    priority: "low",
    dueDate: "2024-08-10",
  },
];

const sampleTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Design homepage mockups",
    description: "Create initial designs for the new homepage",
    status: "completed",
    priority: "medium",
    dueDate: "2024-06-05",
  },
  {
    id: "2",
    projectId: "1",
    title: "Implement responsive design",
    description: "Make sure the website works on all devices",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-06-10",
  },
  {
    id: "3",
    projectId: "1",
    title: "Content migration",
    description: "Move content from old site to new one",
    status: "todo",
    priority: "medium",
    dueDate: "2024-06-12",
  },
  {
    id: "4",
    projectId: "2",
    title: "UI/UX Design",
    description: "Design user interface for mobile app",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-06-20",
  },
  {
    id: "5",
    projectId: "2",
    title: "API Integration",
    description: "Connect to backend APIs",
    status: "todo",
    priority: "high",
    dueDate: "2024-06-25",
  },
  {
    id: "6",
    projectId: "3",
    title: "Create social media posts",
    description: "Design and schedule posts for campaign",
    status: "completed",
    priority: "medium",
    dueDate: "2024-05-20",
  },
  {
    id: "7",
    projectId: "3",
    title: "Track campaign metrics",
    description: "Monitor performance across channels",
    status: "completed",
    priority: "low",
    dueDate: "2024-05-28",
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const getDueDatesForMonth = (startDate: Date, endDate: Date) => {
    const projectDueDates = sampleProjects
      .filter(project => {
        const dueDate = parseISO(project.dueDate);
        return isWithinInterval(dueDate, { start: startDate, end: endDate });
      })
      .map(project => ({
        date: parseISO(project.dueDate),
        type: 'project' as const,
        data: project,
      }));
    
    const taskDueDates = sampleTasks
      .filter(task => {
        const dueDate = parseISO(task.dueDate);
        return isWithinInterval(dueDate, { start: startDate, end: endDate });
      })
      .map(task => ({
        date: parseISO(task.dueDate),
        type: 'task' as const,
        data: task,
      }));
    
    return [...projectDueDates, ...taskDueDates];
  };
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const dueDatesForMonth = getDueDatesForMonth(monthStart, monthEnd);
  
  const getItemsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return dueDatesForMonth.filter(
      item => format(item.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  };
  
  const selectedDateItems = getItemsForSelectedDate();
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const items = dueDatesForMonth.filter(
        item => format(item.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      if (items.length === 0) {
        toast.info(`No deadlines on ${format(date, 'MMMM d, yyyy')}`);
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Project Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Deadlines & Milestones</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() - 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {format(date, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() + 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={date}
                onMonthChange={setDate}
                className="border rounded-md p-3"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                }}
              />
              
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Regular deadline</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>High priority deadline</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? `Items due on ${format(selectedDate, 'MMMM d, yyyy')}`
                  : "Select a date to view deadlines"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && (
                <ScrollArea className="h-[400px] pr-4">
                  {selectedDateItems.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateItems.map((item, index) => (
                        <div
                          key={`${item.type}-${index}`}
                          className="p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              {item.type === 'project' ? (
                                <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                              ) : (
                                <Clock className="h-4 w-4 mr-2 text-green-500" />
                              )}
                              <span className="font-medium text-sm">
                                {item.type === 'project' 
                                  ? item.data.name 
                                  : item.data.title}
                              </span>
                            </div>
                            <Badge
                              variant={
                                item.data.priority === 'high'
                                  ? 'destructive'
                                  : item.data.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-[10px]"
                            >
                              {item.data.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.data.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {item.type === 'project' ? 'Project' : 'Task'}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {item.data.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No deadlines scheduled for this date
                      </p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={() => {
                          toast.info("You can create new tasks or projects from their respective pages");
                        }}
                      >
                        Add a new deadline
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
