import { useState } from 'react';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  avatar: string;
  nextTask?: {
    type: string;
    time: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "walk" | "feeding" | "medication" | "grooming" | "vet" | "play" | string;
  petName: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  date?: Date;
  recurrence: string; // <-- Add this line
}

export interface HealthMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  status: 'good' | 'warning' | 'critical';
}

export const usePetData = () => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '3 years',
      avatar: '🐕',
      nextTask: { type: 'Walk', time: '3:30 PM' }
    },
    {
      id: '2',
      name: 'Whiskers',
      species: 'cat',
      breed: 'Maine Coon',
      age: '5 years',
      avatar: '🐱',
      nextTask: { type: 'Feeding', time: '6:00 PM' }
    },
    {
      id: '3',
      name: 'Nemo',
      species: 'fish',
      breed: 'Goldfish',
      age: '1 year',
      avatar: '🐠'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning Walk',
      description: 'Take Buddy for his regular morning exercise',
      time: '8:00 AM',
      type: 'walk',
      petName: 'Buddy',
      completed: true,
      priority: 'high',
      date: new Date(),
      recurrence: 'none'
    },
    {
      id: '2',
      title: 'Breakfast',
      description: 'Feed Whiskers her morning meal',
      time: '8:30 AM',
      type: 'feeding',
      petName: 'Whiskers',
      completed: true,
      priority: 'high',
      date: new Date(),
      recurrence: 'none'
    },
    {
      id: '3',
      title: 'Medication',
      description: 'Give Buddy his joint supplement',
      time: '12:00 PM',
      type: 'medication',
      petName: 'Buddy',
      completed: false,
      priority: 'high',
      date: new Date(),
      recurrence: 'none'
    },
    {
      id: '4',
      title: 'Afternoon Walk',
      description: 'Second walk of the day for Buddy',
      time: '3:30 PM',
      type: 'walk',
      petName: 'Buddy',
      completed: false,
      priority: 'medium',
      date: new Date(),
      recurrence: 'none'
    },
    {
      id: '5',
      title: 'Playtime',
      description: 'Interactive play session with Whiskers',
      time: '5:00 PM',
      type: 'play',
      petName: 'Whiskers',
      completed: false,
      priority: 'low',
      date: new Date(),
      recurrence: 'none'
    }
  ]);

  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      title: 'Weight',
      value: '32.5',
      unit: 'lbs',
      trend: 'stable',
      lastUpdated: '2 days ago',
      status: 'good'
    },
    {
      id: '2',
      title: 'Heart Rate',
      value: '95',
      unit: 'bpm',
      trend: 'down',
      lastUpdated: '1 week ago',
      status: 'good'
    },
    {
      id: '3',
      title: 'Temperature',
      value: '101.8',
      unit: '°F',
      trend: 'up',
      lastUpdated: '3 days ago',
      status: 'warning'
    },
    {
      id: '4',
      title: 'Activity Level',
      value: '85',
      unit: '%',
      trend: 'up',
      lastUpdated: 'Today',
      status: 'good'
    }
  ]);

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const setReminder = (taskId: string) => {
    console.log(`Setting reminder for task ${taskId}`);
    // In a real app, this would set up a notification
  };

  const addPet = (petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString()
    };
    setPets(prev => [...prev, newPet]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  return {
    pets,
    tasks,
    healthMetrics,
    completeTask,
    setReminder,
    addPet,
    addTask
  };
};
