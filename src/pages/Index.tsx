
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CalendarSchedule from '@/components/schedule/CalendarSchedule';
import AddPetModal from '@/components/pets/AddPetModal';
import AddTaskModal from '@/components/schedule/AddTaskModal';
import PetDetailsModal from '@/components/pets/PetDetailsModal';
import TaskDetailsModal from '@/components/schedule/TaskDetailsModal';
import ScheduleTab from '@/components/dashboard/ScheduleTab';
import MyPetsTab from '@/components/dashboard/MyPetsTab';
import TasksTab from '@/components/dashboard/TasksTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import { useSupabasePets } from '@/hooks/useSupabasePets';
import { useSupabaseTasks, Task } from '@/hooks/useSupabaseTasks';
import { useSupabaseHealthMetrics } from '@/hooks/useSupabaseHealthMetrics';
import { useSupabaseProfiles } from '@/hooks/useSupabaseProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Pet } from '@/hooks/useSupabaseTasks';

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
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedPetForTask, setSelectedPetForTask] = useState<Pet | null>(null);
  const [addTaskDate, setAddTaskDate] = useState<Date | null>(null);

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

  const handleAddTaskNoPet = (date: Date) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedPetForTask(null);
    setAddTaskDate(date);
    setAddTaskModalOpen(true);
  };

  const handleAddTaskSubmit = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTask(taskData);
      setAddTaskModalOpen(false);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schedule': 
        return (
          <ScheduleTab
            user={user}
            pets={pets}
            todaysTasks={todaysTasks}
            completedTasks={completedTasks}
            onAddPet={handleAddPet}
            onAddTask={handleAddTask}
            onPetSelect={handlePetSelect}
            onTaskClick={handleTaskClick}
            onTaskComplete={handleTaskComplete}
            onTaskReminder={handleTaskReminder}
            getPetName={getPetName}
          />
        );
      case 'health': 
        return (
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
      case 'tasks': 
        return (
          <TasksTab
            user={user}
            tasks={tasks}
            todaysTasks={todaysTasks}
            completedTasks={completedTasks}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskComplete={handleTaskComplete}
            onTaskReminder={handleTaskReminder}
            getPetName={getPetName}
          />
        );
      case 'mypets': 
        return (
          <MyPetsTab
            user={user}
            pets={pets}
            onAddPet={handleAddPet}
            onPetSelect={handlePetSelect}
          />
        );
      case 'profile': 
        return (
          <ProfileTab
            user={user}
            profile={profile}
            pets={pets}
            tasks={tasks}
            setActiveTab={setActiveTab}
          />
        );
      default: 
        return (
          <ScheduleTab
            user={user}
            pets={pets}
            todaysTasks={todaysTasks}
            completedTasks={completedTasks}
            onAddPet={handleAddPet}
            onAddTask={handleAddTask}
            onPetSelect={handlePetSelect}
            onTaskClick={handleTaskClick}
            onTaskComplete={handleTaskComplete}
            onTaskReminder={handleTaskReminder}
            getPetName={getPetName}
          />
        );
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
