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
import { useSupabasePets } from '@/hooks/useSupabasePets';
import { useSupabaseTasks, Task } from '@/hooks/useSupabaseTasks';
import { useSupabaseHealthMetrics } from '@/hooks/useSupabaseHealthMetrics';
import { useSupabaseProfiles } from '@/hooks/useSupabaseProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Heart, TrendingUp } from 'lucide-react';
import { Pet } from '@/hooks/useSupabasePets';
import TaskDetailsModal from '@/components/schedule/TaskDetailsModal';
import UserPlanSection from '@/components/plans/UserPlanSection';
import EmptyPetCard from '@/components/pets/EmptyPetCard';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pets, addPet: addPetToSupabase } = useSupabasePets();
  const { tasks, addTask, completeTask, updateTask, deleteTask } = useSupabaseTasks();
  const { healthMetrics } = useSupabaseHealthMetrics();
  const { profile } = useSupabaseProfiles();
  
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todaysTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetDetails(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const getPetTasks = (petId: string) => {
    return tasks.filter(task => task.pet_id === petId);
  };

  const getPetName = (petId: string | null) => {
    if (!petId) return 'General Task';
    const pet = pets.find(p => p.id === petId);
    return pet?.name || 'Unknown Pet';
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
    if (!user) {
      navigate('/signin');
      return;
    }
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
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedPet(pet);
    setShowAddTaskModal(true);
  };

  const handleAddPet = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowAddPetModal(true);
  };

  const handleAddPetSubmit = async (petData: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addPetToSupabase(petData);
      setShowAddPetModal(false);
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  const handleAddTask = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowAddTaskModal(true);
  };

  const handleTaskComplete = async (taskId: string) => {
    await completeTask(taskId);
  };

  const handleTaskReminder = (taskId: string) => {
    console.log('Set reminder for task:', taskId);
    // Would implement reminder logic
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
        <EmptyPetCard onAddPet={handleAddPet} />
      ) : (
        <>
          {/* My Pets - Horizontal Scroll */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">My Pets</h2>
              <Button size="sm" variant="outline" onClick={handleAddPet} className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white">
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

          {/* Today's Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
              <Button size="sm" variant="outline" className="rounded-3xl border-pet-primary text-pet-primary hover:bg-pet-primary/90 hover:text-white" onClick={handleAddTask}>
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
                    onComplete={handleTaskComplete}
                    onRemind={handleTaskReminder}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderMyPetsTab = () => {
    if (!user) {
      return (
        <Card className="p-6 text-center rounded-3xl">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in to view and manage your pets</p>
          <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
            Sign In
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">All My Pets</h2>
          <Button 
            size="sm" 
            className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" 
            onClick={handleAddPet}
          >
            + Add Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <EmptyPetCard onAddPet={handleAddPet} />
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
  };

  const renderProfileTab = () => {
    if (!user) {
      return (
        <Card className="p-6 text-center rounded-3xl">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
            Sign In
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-pet-primary/20 flex items-center justify-center text-4xl mx-auto mb-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <h2 className="text-xl font-bold text-pet-primary mb-2">{profile?.full_name || 'Pet Owner'}</h2>
          <p className="text-muted-foreground">{profile?.email}</p>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile?.user_plan === 'premium' ? 'bg-yellow-100 text-yellow-800' :
              profile?.user_plan === 'pro' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {profile?.user_plan?.toUpperCase() || 'FREE'} Plan
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card className="p-4 rounded-2xl">
            <h3 className="font-semibold mb-2 text-pet-primary">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="font-medium">{profile?.full_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium">{profile?.email || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Pets</span>
                <span className="font-medium">{pets.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tasks</span>
                <span className="font-medium">{tasks.length}</span>
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
  };

  const handleAddTaskNoPet = (date: Date) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedPetForTask(null);
    setAddTaskDate(date);
    setAddTaskModalOpen(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schedule': return renderScheduleTab();
      case 'health': return (
        <CalendarSchedule 
          tasks={tasks}
          onAddTask={handleAddTaskNoPet}
          onCompleteTask={handleTaskComplete}
          onEditTask={(task) => console.log('Edit task:', task)}
          onDeleteTask={deleteTask}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      );
      case 'tasks': return (
        <div className="space-y-6">
          {!user ? (
            <Card className="p-6 text-center rounded-3xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-4">Please sign in to view and manage your tasks</p>
              <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
                Sign In
              </Button>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
                <Button size="sm" className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" onClick={handleAddTask}>
                  + New Task
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <Card className="p-2 text-center rounded-xl pet-card-shadow">
                      <div className="text-2xl font-bold text-green-500">{tasks.length}</div>
                      <div className="text-sm text-muted-foreground">All Tasks</div>
                    </Card>
                    <Card className="p-2 text-center rounded-xl pet-card-shadow">
                      <div className="text-2xl font-bold text-red-500">{tasks.filter(t => t.priority === 'high').length}</div>
                      <div className="text-sm text-muted-foreground">High</div>
                    </Card>
                    <Card className="p-2 text-center rounded-xl pet-card-shadow">
                      <div className="text-2xl font-bold text-orange-500">{tasks.filter(t => t.priority === 'medium').length}</div>
                      <div className="text-sm text-muted-foreground">Medium</div>
                    </Card>
                    <Card className="p-2 text-center rounded-xl pet-card-shadow">
                      <div className="text-2xl font-bold text-yellow-500">{tasks.filter(t => t.priority === 'low').length}</div>
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
                          onComplete={handleTaskComplete}
                          onRemind={handleTaskReminder}
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
                          onComplete={handleTaskComplete}
                          onRemind={handleTaskReminder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      );
      case 'mypets': return renderMyPetsTab();
      case 'profile': return renderProfileTab();
      default: return renderScheduleTab();
    }
  };

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedPetForTask, setSelectedPetForTask] = useState<Pet | null>(null);
  const [addTaskDate, setAddTaskDate] = useState<Date | null>(null);

  const handleAddTaskSubmit = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTask(taskData);
      setAddTaskModalOpen(false);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title={getPageTitle()} 
        onProfileClick={handleProfileClick}
        onSignInClick={handleSignInClick}
      />
      
      <main className="px-4 py-6 pb-24 animate-fade-in">
        {renderActiveTab()}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AddPetModal 
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onAddPet={handleAddPetSubmit}
      />
      
      <AddTaskModal
        isOpen={addTaskModalOpen || showAddTaskModal}
        onClose={() => {
          setAddTaskModalOpen(false);
          setShowAddTaskModal(false);
        }}
        pets={pets}
        onAddTask={handleAddTaskSubmit}
        initialPet={selectedPetForTask}
        initialDate={addTaskDate}
      />

      <PetDetailsModal
        pet={selectedPet}
        isOpen={showPetDetails}
        onClose={() => setShowPetDetails(false)}
        healthMetrics={healthMetrics.filter(hm => hm.pet_id === selectedPet?.id)}
        petTasks={selectedPet ? getPetTasks(selectedPet.id) : []}
        onEditPet={handleEditPet}
        onAddTask={handleAddTaskForPet}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        onComplete={handleTaskComplete}
        onRemind={handleTaskReminder}
      />
    </div>
  );
};

export default Index;
