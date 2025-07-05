
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Bell, MapPin, Calendar } from 'lucide-react';
import { Task } from '@/hooks/usePetData';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string) => void;
  onRemind: (taskId: string) => void;
}

const TaskDetailsModal = ({ task, isOpen, onClose, onComplete, onRemind }: TaskDetailsModalProps) => {
  if (!task) return null;

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
      case 'medium': return 'bg-pet-primary/10 text-pet-primary border-pet-primary/20';
      case 'low': return 'bg-pet-secondary/10 text-pet-secondary border-pet-secondary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-pet-primary">
            Task Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Header */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pet-primary/20 to-pet-secondary/20 flex items-center justify-center text-4xl mx-auto mb-4">
              {getTaskEmoji(task.type)}
            </div>
            <h2 className="text-2xl font-bold text-pet-primary mb-1">{task.title}</h2>
            <Badge variant="outline" className={`text-sm rounded-2xl ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </Badge>
          </div>

          {/* Task Details */}
          <Card className="p-6 rounded-3xl bg-pet-surface/30">
            <h3 className="font-semibold mb-4 text-pet-primary">Task Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-pet-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{task.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-xl">🐾</span>
                <div>
                  <p className="font-medium">Pet</p>
                  <p className="text-sm text-muted-foreground">{task.petName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-pet-primary mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </div>

              {task.type === 'vet' && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-pet-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">Veterinary Clinic</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!task.completed && (
              <>
                <Button 
                  onClick={() => {
                    onComplete(task.id);
                    onClose();
                  }}
                  className="w-full bg-pet-primary hover:bg-pet-primary/90 rounded-2xl h-12"
                >
                  ✓ Mark as Complete
                </Button>
                
                <Button 
                  onClick={() => {
                    onRemind(task.id);
                    onClose();
                  }}
                  variant="outline"
                  className="w-full rounded-2xl h-12 border-pet-secondary text-pet-secondary hover:bg-pet-secondary/10"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </Button>
              </>
            )}
            
            <Button 
              onClick={onClose} 
              variant="ghost"
              className="w-full rounded-2xl h-12 hover:bg-pet-surface/50"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
