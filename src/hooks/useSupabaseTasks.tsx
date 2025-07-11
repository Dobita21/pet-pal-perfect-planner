
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  user_id: string;
  pet_id: string | null;
  title: string;
  description: string | null;
  time: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  date: string;
  recurrence: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform and type-cast the data
      const transformedTasks: Task[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        pet_id: item.pet_id,
        title: item.title,
        description: item.description,
        time: item.time,
        type: item.type,
        priority: (item.priority as 'high' | 'medium' | 'low') || 'medium',
        completed: item.completed || false,
        date: item.date || new Date().toISOString().split('T')[0],
        recurrence: item.recurrence || 'none',
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
      }));
      
      setTasks(transformedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const transformedTask: Task = {
        id: data.id,
        user_id: data.user_id,
        pet_id: data.pet_id,
        title: data.title,
        description: data.description,
        time: data.time,
        type: data.type,
        priority: (data.priority as 'high' | 'medium' | 'low') || 'medium',
        completed: data.completed || false,
        date: data.date || new Date().toISOString().split('T')[0],
        recurrence: data.recurrence || 'none',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      
      setTasks(prev => [transformedTask, ...prev]);
      toast({
        title: "Success",
        description: "Task added successfully!",
      });
      
      return transformedTask;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTask: Task = {
        id: data.id,
        user_id: data.user_id,
        pet_id: data.pet_id,
        title: data.title,
        description: data.description,
        time: data.time,
        type: data.type,
        priority: (data.priority as 'high' | 'medium' | 'low') || 'medium',
        completed: data.completed || false,
        date: data.date || new Date().toISOString().split('T')[0],
        recurrence: data.recurrence || 'none',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      
      setTasks(prev => prev.map(task => task.id === taskId ? transformedTask : task));
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
      
      return transformedTask;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeTask = async (taskId: string) => {
    return updateTask(taskId, { completed: true });
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    refetch: fetchTasks
  };
};
