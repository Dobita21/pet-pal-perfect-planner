import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PetCard from '@/components/pets/PetCard';
import TaskCard from '@/components/schedule/TaskCard';
import CalendarSchedule from '@/components/schedule/CalendarSchedule';
import AddPetModal from '@/components/pets/AddPetModal';
import AddTaskModal from '@/components/schedule/AddTaskModal';
import InfinityCarousel from '@/components/carousel/InfinityCarousel';
import PetDetailsModal from '@/components/pets/PetDetailsModal';
import { usePetData } from '@/hooks/usePetData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Heart, TrendingUp } from 'lucide-react';
import { Pet } from '@/hooks/usePetData';
import TaskDetailsModal from '@/components/schedule/TaskDetailsModal';
import UserPlanSection from '@/components/plans/UserPlanSection';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSignedIn, setIsSignedIn] = useState(false); // Mock auth state
  const { pets, tasks, healthMetrics, completeTask, setReminder, addPet, addTask } = usePetData();

  const todaysTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetDetails(true);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const getPetTasks = (petName: string) => {
    return tasks.filter(task => task.petName === petName);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'schedule': return 'Pet Pal';
      case 'health': return 'Schedule';
      case 'tasks': return 'Tasks';
      case 'mypets': return 'My Pets';
      case 'profile': return 'Profile';
      default: return 'Pet Pal';
    }
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleEditPet = (pet: Pet) => {
    console.log('Edit pet:', pet.name);
    // Would open edit pet modal
  };

  const handleAddTaskForPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowAddTaskModal(true);
  };

  const renderScheduleTab = () => (
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

      {/* Get Your First Pet Section - Show when no pets */}
      {pets.length === 0 && (
        <Card className="p-6 text-center rounded-3xl pet-card-shadow bg-gradient-to-br from-pet-primary/10 to-pet-secondary/10">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-xl font-bold text-pet-primary mb-2">Get Your First Pet!</h2>
          <p className="text-muted-foreground mb-4">Start your journey by adding your beloved companion</p>
          <Button 
            onClick={() => setShowAddPetModal(true)}
            className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl px-8"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your Pet
          </Button>
        </Card>
      )}

      {/* My Pets - Horizontal Scroll */}
      {pets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">My Pets</h2>
            <Button size="sm" variant="outline" onClick={() => setShowAddPetModal(true)} className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white">
              + Add Pet
            </Button>
          </div>
          
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {pets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                onSelect={handlePetSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks - Show only first task */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
          <Button size="sm" variant="outline" className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white" onClick={() => setShowAddTaskModal(true)}>
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
              onClick={() => handleTaskClick(todaysTasks[0])}
            >
              <TaskCard
                key={todaysTasks[0].id}
                task={todaysTasks[0]}
                onComplete={completeTask}
                onRemind={setReminder}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyPetsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All My Pets</h2>
        <Button 
          size="sm" 
          className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" 
          onClick={() => setShowAddPetModal(true)}
        >
          + Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card className="p-8 text-center rounded-3xl">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold text-pet-primary mb-2">No pets yet</h3>
          <p className="text-muted-foreground mb-4">Add your first pet to get started</p>
          <Button 
            onClick={() => setShowAddPetModal(true)}
            className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl"
          >
            Add Pet
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onSelect={handlePetSelect}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-pet-primary/20 flex items-center justify-center text-4xl mx-auto mb-4">
          👤
        </div>
        <h2 className="text-xl font-bold text-pet-primary mb-2">User Profile</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      
      <div className="space-y-4">
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold mb-2 text-pet-primary">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Name</span>
              <span className="font-medium">Pet Owner</span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span className="font-medium">user@example.com</span>
            </div>
            <div className="flex justify-between">
              <span>Pets</span>
              <span className="font-medium">{pets.length}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold mb-2 text-pet-primary">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => setActiveTab('mypets')}
            >
              My Pets
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => navigate('/health')}
            >
              Health Records
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => setActiveTab('tasks')}
            >
              All Tasks
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schedule': return renderScheduleTab();
      case 'health': return (
        <CalendarSchedule 
          tasks={tasks}
          onAddTask={() => setShowAddTaskModal(true)}
          onCompleteTask={completeTask}
          onEditTask={(task) => console.log('Edit task:', task)}
          onDeleteTask={(taskId) => console.log('Delete task:', taskId)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      );
      case 'tasks': return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
            <Button size="sm" className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" onClick={() => setShowAddTaskModal(true)}>
              + New Task
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <Card className="p-2 text-center rounded-xl pet-card-shadow">
                  <div className="text-2xl font-bold text-green-500">{todaysTasks.length}</div>
                  <div className="text-sm text-muted-foreground">All Tasks</div>
                </Card>
                <Card className="p-2 text-center rounded-xl pet-card-shadow">
                  <div className="text-2xl font-bold text-red-500">{completedTasks.length}</div>
                  <div className="text-sm text-muted-foreground">High</div>
                </Card>
                <Card className="p-2 text-center rounded-xl pet-card-shadow">
                  <div className="text-2xl font-bold text-orange-500">{pets.length}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </Card>
                <Card className="p-2 text-center rounded-xl pet-card-shadow">
                  <div className="text-2xl font-bold text-yellow-500">{pets.length}</div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </Card>
              </div>
              <h3 className="text-md font-semibold text-foreground mb-3">Pending Tasks</h3>
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <div 
                    key={task.id}
                    className="cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <TaskCard
                      task={task}
                      onComplete={completeTask}
                      onRemind={setReminder}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-foreground mb-3">Completed Today</h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div 
                    key={task.id}
                    className="cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <TaskCard
                      task={task}
                      onComplete={completeTask}
                      onRemind={setReminder}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      case 'mypets': return renderMyPetsTab();
      case 'profile': return renderProfileTab();
      default: return renderScheduleTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title={getPageTitle()} 
        onProfileClick={handleProfileClick}
        onSignInClick={handleSignInClick}
        isSignedIn={isSignedIn}
      />
      
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
        initialDate={selectedDate}
      />

      <PetDetailsModal
        pet={selectedPet}
        isOpen={showPetDetails}
        onClose={() => setShowPetDetails(false)}
        healthMetrics={healthMetrics}
        petTasks={selectedPet ? getPetTasks(selectedPet.name) : []}
        onEditPet={handleEditPet}
        onAddTask={handleAddTaskForPet}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        onComplete={completeTask}
        onRemind={setReminder}
      />
    </div>
  );
};

export default Index;
