import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, MapPin, Stethoscope, BluetoothConnectedIcon, CalendarSyncIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'feeding' | 'walk' | 'medication' | 'grooming' | 'vet' | 'play';
  petName: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  date?: Date;
}

interface CalendarScheduleProps {
  tasks: Task[];
  onAddTask: () => void;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  selectedDate: Date; // <-- Add this line
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>; // <-- Add this line
}

const CalendarSchedule = ({
  tasks,
  onAddTask,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  selectedDate,
  setSelectedDate,
}: CalendarScheduleProps) => {
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = task.date || new Date();
      return isSameDay(taskDate, date);
    });
  };

  // Use selectedDate from props
  const selectedDateTasks = getTasksForDate(selectedDate);

  const getTaskEmoji = (type: string) => {
    switch (type) {
      case 'feeding': return '🍽️';
      case 'walk': return '🚶';
      case 'medication': return '💊';
      case 'grooming': return '🛁';
      case 'vet': return '🏥';
      case 'play': return '🎾';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-pet-pink/10 text-pet-purple border-pet-pink/20';
      case 'low': return 'bg-pet-primary/10 text-pet-primary border-pet-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  // 1. Get all dates that have tasks
  const taskDates = tasks
    .filter(task => !!task.date)
    .map(task => {
      // Remove time for comparison
      const d = task.date as Date;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });

  // 2. Remove duplicates
  const uniqueTaskDates = Array.from(
    new Set(taskDates.map(d => d.getTime()))
  ).map(time => new Date(time));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Schedule Calendar</h2>
        <div className='flex items-center justify-between space-x-1'>
        <Button size="sm" className="bg-pet-primary/20 hover:bg-pet-primary/90 text-orange-500" onClick={onAddTask}>
          +
        </Button>
        <Button size="sm" className="bg-pet-primary hover:bg-pet-primary/90" onClick={onAddTask}>
          <CalendarSyncIcon className="h-4 w-4" />
          Google
        </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border-0"
          modifiers={{ hasTask: uniqueTaskDates }}
          modifiersClassNames={{
            hasTask: "text-pet-primary font-bold" // or use bg-pet-primary/10 for background
          }}
        />
      </Card>

      {/* Selected Date Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <Badge variant="outline" className="bg-pet-background text-pet-primary">
            {selectedDateTasks.length} tasks
          </Badge>
        </div>

        {selectedDateTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-muted-foreground mb-4">No tasks scheduled for this day</p>
            <Button variant="outline" onClick={onAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedDateTasks.map(task => (
              <Card key={task.id} className={`p-4 transition-all duration-200 ${
                task.completed ? 'opacity-60 bg-pet-background/30' : 'pet-card-shadow hover:shadow-lg bg-white'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl mt-1">
                      {getTaskEmoji(task.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-pet-primary'
                        }`}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.time}</span>
                        </div>
                        <span>•</span>
                        <span>{task.petName}</span>
                        {task.type === 'vet' && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Stethoscope className="h-3 w-3" />
                              <span>Vet Visit</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-3">
                    {!task.completed && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteTask(task.id)}
                        className="bg-pet-primary hover:bg-pet-primary/90 text-white h-8 w-8 p-0"
                      >
                        ✓
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditTask(task)}
                      className="h-8 w-8 p-0 hover:bg-pet-background"
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteTask(task.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSchedule;
