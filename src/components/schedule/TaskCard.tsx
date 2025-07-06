import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Bell, EllipsisVertical } from 'lucide-react';
import type { Task } from '@/hooks/usePetData';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onRemind: (taskId: string) => void;
  onRemove?: (taskId: string) => void; // Add this line
}

const TaskCard = ({ task, onComplete, onRemind, onRemove }: TaskCardProps) => {
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
      case 'medium': return 'bg-pet-orange/10 text-pet-primary border-pet-orange/20';
      case 'low': return 'bg-pet-primary/10 text-pet-primary border-pet-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const handleSetNotification = () => {
    onRemind(task.id);
    // Add visual feedback
    console.log(`Notification set for task: ${task.title}`);
    // You could also show a toast notification here
  };

  return (
    <Card className={`p-4 transition-all duration-200 rounded-2xl ${task.completed ? 'opacity-60 bg-pet-background/30' : 'pet-card-shadow hover:shadow-lg bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl mt-1">
            {getTaskEmoji(task.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-pet-primary'}`}>
                {task.title}
              </h3>
              <Badge variant="outline" className={`text-xs rounded-xl ${getPriorityColor(task.priority)}`}>
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
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-3">
          {!task.completed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 hover:bg-pet-background rounded-xl"
                  title="Task actions"
                >
                  <EllipsisVertical className="h-4 w-4 text-pet-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSetNotification}>
                  <Bell className="h-4 w-4 text-pet-orange mr-2" />
                  Set notification
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onComplete(task.id)}>
                  <span className="text-pet-primary font-bold mr-2">✓</span>
                  Mark as complete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRemove(task.id)}
                  className="text-destructive"
                >
                  🗑️ Remove task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
