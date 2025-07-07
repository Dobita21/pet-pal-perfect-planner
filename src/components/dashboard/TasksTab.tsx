
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/schedule/TaskCard';
import { Task } from '@/hooks/useSupabaseTasks';

interface TasksTabProps {
  user: any;
  tasks: Task[];
  todaysTasks: Task[];
  completedTasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onTaskComplete: (taskId: string) => Promise<void>;
  onTaskReminder: (taskId: string) => void;
  getPetName: (petId: string | null) => string;
}

const TasksTab = ({
  user,
  tasks,
  todaysTasks,
  completedTasks,
  onAddTask,
  onTaskClick,
  onTaskComplete,
  onTaskReminder,
  getPetName,
}: TasksTabProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Card className="p-6 text-center rounded-3xl">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">Please sign in to view and manage your tasks</p>
        <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
          Sign In
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
        <Button size="sm" className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" onClick={onAddTask}>
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
                onClick={() => onTaskClick(task)}
              >
                <TaskCard
                  task={task}
                  petName={getPetName(task.pet_id)}
                  onComplete={onTaskComplete}
                  onRemind={onTaskReminder}
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
                onClick={() => onTaskClick(task)}
              >
                <TaskCard
                  task={task}
                  petName={getPetName(task.pet_id)}
                  onComplete={onTaskComplete}
                  onRemind={onTaskReminder}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
