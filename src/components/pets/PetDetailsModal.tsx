
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Activity, Clock, MapPin } from 'lucide-react';
import { Pet, HealthMetric, Task } from '@/hooks/usePetData';

interface PetDetailsModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  healthMetrics: HealthMetric[];
  petTasks: Task[];
}

const PetDetailsModal = ({ pet, isOpen, onClose, healthMetrics, petTasks }: PetDetailsModalProps) => {
  if (!pet) return null;

  const getSpeciesEmoji = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🦜';
      case 'fish': return '🐠';
      case 'rabbit': return '🐰';
      default: return '🐾';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-pet-green/10 text-pet-green border-pet-green/20';
      case 'warning': return 'bg-pet-orange/10 text-pet-primary border-pet-orange/20';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-pet-primary">
            {pet.name}'s Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pet Header */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pet-primary/20 to-pet-yellow/20 flex items-center justify-center text-5xl mx-auto mb-4">
              {getSpeciesEmoji(pet.species)}
            </div>
            <h2 className="text-2xl font-bold text-pet-primary mb-1">{pet.name}</h2>
            <p className="text-muted-foreground">{pet.breed} • {pet.age}</p>
          </div>

          {/* Basic Info */}
          <Card className="p-4 rounded-2xl">
            <h3 className="font-semibold mb-3 text-pet-primary">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Species</span>
                <span className="capitalize font-medium">{pet.species}</span>
              </div>
              <div className="flex justify-between">
                <span>Breed</span>
                <span className="font-medium">{pet.breed}</span>
              </div>
              <div className="flex justify-between">
                <span>Age</span>
                <span className="font-medium">{pet.age}</span>
              </div>
            </div>
          </Card>

          {/* Health Metrics */}
          <div>
            <h3 className="font-semibold mb-3 text-pet-primary flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Health Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {healthMetrics.slice(0, 4).map(metric => (
                <Card key={metric.id} className="p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-pet-primary">{metric.title}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-pet-primary">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div>
            <h3 className="font-semibold mb-3 text-pet-primary flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Tasks
            </h3>
            <div className="space-y-2">
              {petTasks.slice(0, 3).map(task => (
                <Card key={task.id} className={`p-3 rounded-xl ${task.completed ? 'bg-pet-green/5' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{task.type === 'feeding' ? '🍽️' : task.type === 'walk' ? '🚶' : '💊'}</span>
                      <div>
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-pet-primary'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.time}
                        </p>
                      </div>
                    </div>
                    {task.completed && (
                      <Badge className="bg-pet-green text-white text-xs">✓</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Next Task */}
          {pet.nextTask && (
            <Card className="p-4 rounded-2xl bg-pet-primary/5 border-pet-primary/20">
              <h3 className="font-semibold mb-2 text-pet-primary">Next Task</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-pet-primary" />
                <span className="font-medium">{pet.nextTask.type}</span>
                <span className="text-muted-foreground">at {pet.nextTask.time}</span>
              </div>
            </Card>
          )}

          <Button 
            onClick={onClose} 
            className="w-full bg-pet-primary hover:bg-pet-primary/90 rounded-2xl"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PetDetailsModal;
