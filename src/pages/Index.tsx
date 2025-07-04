
import React, { useState } from 'react';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PetCard from '@/components/pets/PetCard';
import TaskCard from '@/components/schedule/TaskCard';
import HealthCard from '@/components/health/HealthCard';
import { usePetData } from '@/hooks/usePetData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Heart, TrendingUp } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const { pets, tasks, healthMetrics, completeTask, setReminder } = usePetData();

  const todaysTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{todaysTasks.length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-pet-green">{completedTasks.length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{pets.length}</div>
          <div className="text-sm text-muted-foreground">Pets</div>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-3">
          {todaysTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={completeTask}
              onRemind={setReminder}
            />
          ))}
        </div>
      </div>

      {/* My Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">My Pets</h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Pet
          </Button>
        </div>
        
        <div className="space-y-3">
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onSelect={(pet) => console.log('Selected pet:', pet.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Health Overview</h2>
        <Button size="sm" className="bg-pet-green hover:bg-pet-green/90">
          <Plus className="h-4 w-4 mr-1" />
          Log Data
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {healthMetrics.map(metric => (
          <HealthCard
            key={metric.id}
            metric={metric}
            onClick={(metric) => console.log('Selected metric:', metric.title)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Vet Visit</div>
                <div className="text-sm text-muted-foreground">Schedule appointment</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-pet-green/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-pet-green" />
              </div>
              <div>
                <div className="font-medium">Weight Log</div>
                <div className="text-sm text-muted-foreground">Track progress</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Pending Tasks</h3>
          <div className="space-y-3">
            {todaysTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onRemind={setReminder}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Completed Today</h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onRemind={setReminder}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full pet-gradient mx-auto mb-4 flex items-center justify-center text-3xl">
          👤
        </div>
        <h2 className="text-xl font-bold text-foreground">Pet Parent Profile</h2>
        <p className="text-muted-foreground">Managing {pets.length} beloved pets</p>
      </div>

      <div className="space-y-3">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Account Settings</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Notifications</span>
              <span className="text-pet-green">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Data Sync</span>
              <span className="text-pet-green">Active</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">App Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tasks Completed</span>
              <span className="font-medium">{completedTasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Days Active</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span>Health Records</span>
              <span className="font-medium">{healthMetrics.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const getPageTitle = () => {
    switch (activeTab) {
      case 'schedule': return 'Pet Pal';
      case 'health': return 'Health';
      case 'tasks': return 'Tasks';
      case 'profile': return 'Profile';
      default: return 'Pet Pal';
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schedule': return renderScheduleTab();
      case 'health': return renderHealthTab();
      case 'tasks': return renderTasksTab();
      case 'profile': return renderProfileTab();
      default: return renderScheduleTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title={getPageTitle()} />
      
      <main className="px-4 py-6 pb-24 animate-fade-in">
        {renderActiveTab()}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
