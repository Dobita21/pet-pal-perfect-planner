
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Bell } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'feeding' | 'walk' | 'medication' | 'grooming' | 'vet' | 'play';
  petName: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onRemind: (taskId: string) => void;
}

const TaskCard = ({ task, onComplete, onRemind }: TaskCardProps) => {
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
      case 'medium': return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${task.completed ? 'opacity-60 bg-muted/30' : 'pet-card-shadow hover:shadow-lg'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl mt-1">
            {getTaskEmoji(task.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </h3>
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
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-3">
          {!task.completed && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemind(task.id)}
                className="h-8 w-8 p-0"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onComplete(task.id)}
                className="bg-pet-green hover:bg-pet-green/90 text-white h-8 w-8 p-0"
              >
                ✓
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
