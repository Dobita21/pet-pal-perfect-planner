
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Activity, Clock, MapPin, Edit, Plus, Menu, Image, Stethoscope } from 'lucide-react';
import { Pet, HealthMetric, Task } from '@/hooks/usePetData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface PetDetailsModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  healthMetrics: HealthMetric[];
  petTasks: Task[];
  onEditPet?: (pet: Pet) => void;
  onAddTask?: (pet: Pet) => void;
}

const PetDetailsModal = ({ 
  pet, 
  isOpen, 
  onClose, 
  healthMetrics, 
  petTasks, 
  onEditPet,
  onAddTask 
}: PetDetailsModalProps) => {
  const navigate = useNavigate();

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
      case 'warning': return 'bg-pet-primary/10 text-pet-primary border-pet-primary/20';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const isUploadedImage = pet.avatar.startsWith('data:') || pet.avatar.startsWith('http');

  const handleEditPet = () => {
    console.log('Edit pet:', pet.name);
    onEditPet?.(pet);
    onClose();
  };

  const handleAddTask = () => {
    console.log('Add task for:', pet.name);
    onAddTask?.(pet);
    onClose();
  };

  const handleGallery = () => {
    console.log('Open gallery for:', pet.name);
    // Would open pet photo gallery
    onClose();
  };

  const handleNavigateToHealth = () => {
    onClose();
    navigate('/health');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl mx-auto p-4" hideCloseButton>
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-lg font-bold text-pet-primary">
              {pet.name}'s Profile
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                <DropdownMenuItem className="cursor-pointer" onClick={handleEditPet}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pet
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleAddTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleGallery}>
                  <Image className="h-4 w-4 mr-2" />
                  Gallery
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleNavigateToHealth}>
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Health
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Pet Header and Basic Info in 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pet Photo */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-pet-primary/20 to-pet-secondary/20 flex items-center justify-center text-3xl overflow-hidden">
                {isUploadedImage ? (
                  <img 
                    src={pet.avatar} 
                    alt={pet.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  getSpeciesEmoji(pet.species)
                )}
              </div>
            </div>

            {/* Basic Info */}
            <Card className="p-3 rounded-2xl">
              <h3 className="font-semibold mb-2 text-pet-primary text-xs">{pet.name}</h3>
              <div className="space-y-1 text-xs">
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
          </div>

          {/* Health Metrics */}
          <div>
            <h3 className="font-semibold mb-2 text-pet-primary flex items-center text-xs">
              <Heart className="h-3 w-3 mr-1" />
              Health Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {healthMetrics.slice(0, 4).map(metric => (
                <Card key={metric.id} className="p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-pet-primary">{metric.title}</span>
                    <Badge variant="outline" className={`text-xs rounded-xl px-1 py-0 ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xs font-bold text-pet-primary">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div>
            <h3 className="font-semibold mb-2 text-pet-primary flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Recent Task
            </h3>
            <div className="space-y-2">
              {petTasks.slice(0, 1).map(task => (
                <Card key={task.id} className={`p-2 rounded-2xl ${task.completed ? 'bg-pet-green/5' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{task.type === 'feeding' ? '🍽️' : task.type === 'walk' ? '🚶' : '💊'}</span>
                      <div>
                        <p className={`text-xs font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-pet-primary'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-2 w-2 mr-1" />
                          {task.time}
                        </p>
                      </div>
                    </div>
                    {task.completed && (
                      <Badge className="bg-pet-green text-white text-xs rounded-xl px-2 py-0">✓</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PetDetailsModal;
