
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from '@/components/schedule/TaskCard';
import { Task } from '@/hooks/useSupabaseTasks';
import { Filter } from 'lucide-react';

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
  const [filter, setFilter] = useState('all');

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

  const getFilteredTasks = (taskList: Task[]) => {
    if (filter === 'all') return taskList;
    return taskList.filter(task => task.priority === filter);
  };

  const repeatTasks = tasks.filter(task => task.recurrence !== 'none' && !task.completed);
  const pendingTasks = tasks.filter(task => task.recurrence === 'none' && !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All Tasks</h2>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-8 rounded-2xl">
              <div className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="medium">🟠 Medium</SelectItem>
              <SelectItem value="low">🟡 Low</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" onClick={onAddTask}>
            + New Task
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Stats */}
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

        {/* Today Tasks */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3">Today's Tasks</h3>
          <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
            {getFilteredTasks(todaysTasks).length === 0 ? (
              <Card className="p-4 text-center rounded-3xl min-w-64">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm text-muted-foreground">No tasks for today</p>
              </Card>
            ) : (
              getFilteredTasks(todaysTasks).map(task => (
                <div 
                  key={task.id}
                  className="cursor-pointer min-w-80"
                  onClick={() => onTaskClick(task)}
                >
                  <TaskCard
                    task={task}
                    petName={getPetName(task.pet_id)}
                    onComplete={onTaskComplete}
                    onRemind={onTaskReminder}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Repeat Tasks */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3">Recurring Tasks</h3>
          <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
            {getFilteredTasks(repeatTasks).length === 0 ? (
              <Card className="p-4 text-center rounded-3xl min-w-64">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-sm text-muted-foreground">No recurring tasks</p>
              </Card>
            ) : (
              getFilteredTasks(repeatTasks).map(task => (
                <div 
                  key={task.id}
                  className="cursor-pointer min-w-80"
                  onClick={() => onTaskClick(task)}
                >
                  <TaskCard
                    task={task}
                    petName={getPetName(task.pet_id)}
                    onComplete={onTaskComplete}
                    onRemind={onTaskReminder}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Pending Tasks */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3">Other Pending Tasks</h3>
          <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
            {getFilteredTasks(pendingTasks).length === 0 ? (
              <Card className="p-4 text-center rounded-3xl min-w-64">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm text-muted-foreground">No pending tasks</p>
              </Card>
            ) : (
              getFilteredTasks(pendingTasks).map(task => (
                <div 
                  key={task.id}
                  className="cursor-pointer min-w-80"
                  onClick={() => onTaskClick(task)}
                >
                  <TaskCard
                    task={task}
                    petName={getPetName(task.pet_id)}
                    onComplete={onTaskComplete}
                    onRemind={onTaskReminder}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3">Completed Today</h3>
          <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
            {getFilteredTasks(completedTasks).length === 0 ? (
              <Card className="p-4 text-center rounded-3xl min-w-64">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-sm text-muted-foreground">No completed tasks yet</p>
              </Card>
            ) : (
              getFilteredTasks(completedTasks).map(task => (
                <div 
                  key={task.id}
                  className="cursor-pointer min-w-80"
                  onClick={() => onTaskClick(task)}
                >
                  <TaskCard
                    task={task}
                    petName={getPetName(task.pet_id)}
                    onComplete={onTaskComplete}
                    onRemind={onTaskReminder}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
