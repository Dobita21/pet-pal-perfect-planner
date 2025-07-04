import React, { useState } from 'react';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PetCard from '@/components/pets/PetCard';
import TaskCard from '@/components/schedule/TaskCard';
import HealthCard from '@/components/health/HealthCard';
import CalendarSchedule from '@/components/schedule/CalendarSchedule';
import AddPetModal from '@/components/pets/AddPetModal';
import AddTaskModal from '@/components/schedule/AddTaskModal';
import { usePetData } from '@/hooks/usePetData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Heart, TrendingUp } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const { pets, tasks, healthMetrics, completeTask, setReminder, addPet, addTask } = usePetData();

  const todaysTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden pet-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to Pet Pal</h1>
            <p className="text-lg opacity-90">Your pet's health and happiness companion</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className="text-4xl">🐾</span>
        </div>
      </div>

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
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowAddTaskModal(true)}>
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

      {/* My Pets - Horizontal Scroll */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">My Pets</h2>
          <Button size="sm" variant="outline" onClick={() => setShowAddPetModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Pet
          </Button>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
          {pets.map(pet => (
            <div key={pet.id} className="min-w-[280px] flex-shrink-0">
              <PetCard
                pet={pet}
                onSelect={(pet) => console.log('Selected pet:', pet.name)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Health Overview - Only show if pets exist */}
      {pets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Health Overview</h2>
            <Button size="sm" className="bg-pet-green hover:bg-pet-green/90">
              <Plus className="h-4 w-4 mr-1" />
              Log Data
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {healthMetrics.slice(0, 4).map(metric => (
              <HealthCard
                key={metric.id}
                metric={metric}
                onClick={(metric) => console.log('Selected metric:', metric.title)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHealthTab = () => (
    <CalendarSchedule 
      tasks={tasks}
      onAddTask={() => setShowAddTaskModal(true)}
      onCompleteTask={completeTask}
      onEditTask={(task) => console.log('Edit task:', task)}
      onDeleteTask={(taskId) => console.log('Delete task:', taskId)}
    />
  );

  const renderTasksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowAddTaskModal(true)}>
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
      case 'health': return 'Schedule';
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
      
      <AddPetModal 
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onAddPet={addPet}
      />
      
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={addTask}
        pets={pets}
      />
    </div>
  );
};

export default Index;
