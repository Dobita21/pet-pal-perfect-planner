
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/pets/PetCard';
import TaskCard from '@/components/schedule/TaskCard';
import InfinityCarousel from '@/components/carousel/InfinityCarousel';
import EmptyPetCard from '@/components/pets/EmptyPetCard';
import { Pet } from '@/hooks/useSupabasePets';
import { Task } from '@/hooks/useSupabaseTasks';

interface ScheduleTabProps {
  user: any;
  pets: Pet[];
  todaysTasks: Task[];
  completedTasks: Task[];
  onAddPet: () => void;
  onAddTask: () => void;
  onPetSelect: (pet: Pet) => void;
  onTaskClick: (task: Task) => void;
  onTaskComplete: (taskId: string) => Promise<void>;
  onTaskReminder: (taskId: string) => void;
  getPetName: (petId: string | null) => string;
}

const ScheduleTab = ({
  user,
  pets,
  todaysTasks,
  completedTasks,
  onAddPet,
  onAddTask,
  onPetSelect,
  onTaskClick,
  onTaskComplete,
  onTaskReminder,
  getPetName,
}: ScheduleTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Infinity Carousel Banner */}
      <InfinityCarousel />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center rounded-2xl pet-card-shadow">
          <div className="text-2xl font-bold text-yellow-500">{todaysTasks.length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center rounded-2xl pet-card-shadow">
          <div className="text-2xl font-bold text-pet-green">{completedTasks.length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 text-center rounded-2xl pet-card-shadow">
          <div className="text-2xl font-bold text-pet-primary">{pets.length}</div>
          <div className="text-sm text-muted-foreground">Pets</div>
        </Card>
      </div>

      {/* Authentication-based content */}
      {!user ? (
        <Card className="p-6 text-center rounded-3xl">
          <div className="text-4xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Pet Pal!</h3>
          <p className="text-muted-foreground mb-4">Sign in to manage your pets and their care schedule</p>
          <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
            Sign In to Get Started
          </Button>
        </Card>
      ) : pets.length === 0 ? (
        <EmptyPetCard onAddPet={onAddPet} />
      ) : (
        <>
          {/* My Pets - Horizontal Scroll */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">My Pets</h2>
              <Button size="sm" variant="outline" onClick={onAddPet} className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white">
                + Add Pet
              </Button>
            </div>
            
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              {pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onSelect={onPetSelect}
                />
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
              <Button size="sm" variant="outline" className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white" onClick={onAddTask}>
                + Add Task
              </Button>
            </div>
            
            <div className="space-y-3">
              {todaysTasks.length === 0 ? (
                <Card className="p-6 text-center rounded-3xl">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-muted-foreground">No tasks for today</p>
                </Card>
              ) : (
                <div 
                  className="cursor-pointer"
                  onClick={() => onTaskClick(todaysTasks[0])}
                >
                  <TaskCard
                    key={todaysTasks[0].id}
                    task={todaysTasks[0]}
                    petName={getPetName(todaysTasks[0].pet_id)}
                    onComplete={onTaskComplete}
                    onRemind={onTaskReminder}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleTab;
