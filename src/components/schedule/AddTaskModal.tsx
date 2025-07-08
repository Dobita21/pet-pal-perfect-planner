
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, DollarSign, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import type { Task } from '@/hooks/useSupabaseTasks';
import type { Pet } from '@/hooks/useSupabasePets';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  pets: Pet[];
  initialDate?: Date;
  initialPet?: Pet | null;
}

const defaultTaskTypes = [
  { value: 'feeding', label: '🍽️ Feeding' },
  { value: 'walk', label: '🚶 Walk' },
  { value: 'medication', label: '💊 Medication' },
  { value: 'grooming', label: '🛁 Grooming' },
  { value: 'vet', label: '🏥 Vet Visit' },
  { value: 'play', label: '🎾 Playtime' },
];

const recurrenceOptions = [
  { value: 'none', label: 'Does not repeat' },
  { value: '1day', label: 'Every day' },
  { value: '3days', label: 'Every 3 days' },
  { value: '5days', label: 'Every 5 days' },
  { value: '7days', label: 'Every week' },
  { value: '2weeks', label: 'Every 2 weeks' },
  { value: '1month', label: 'Every month' },
  { value: '3months', label: 'Every 3 months' },
  { value: '6months', label: 'Every 6 months' },
  { value: '12months', label: 'Every year' },
];

const recurrenceIntervals: Record<string, { count: number; unit: 'day' | 'month'; step: number }> = {
  '1day': { count: 14, unit: 'day', step: 1 },
  '3days': { count: 6, unit: 'day', step: 3 },
  '5days': { count: 6, unit: 'day', step: 5 },
  '7days': { count: 8, unit: 'day', step: 7 },
  '2weeks': { count: 6, unit: 'day', step: 14 },
  '1month': { count: 12, unit: 'month', step: 1 },
  '3months': { count: 4, unit: 'month', step: 3 },
  '6months': { count: 2, unit: 'month', step: 6 },
  '12months': { count: 2, unit: 'month', step: 12 },
  'monthly': { count: 12, unit: 'month', step: 1 },
};

const AddTaskModal = ({ isOpen, onClose, onAddTask, pets, initialDate, initialPet }: AddTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    type: 'feeding' as string,
    pet_id: null as string | null,
    priority: 'medium' as Task['priority'],
    date: new Date().toISOString().split('T')[0],
    recurrence: 'none',
    completed: false
  });
  const [cost, setCost] = useState('');
  const [taskTypes, setTaskTypes] = useState(defaultTaskTypes);
  const [customType, setCustomType] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);

  const getSpeciesEmoji = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🦜';
      case 'fish': return '🐠';
      case 'rabbit': return '🐰';
      default: return '🐾';
    }
  };

  const handleAddCustomType = () => {
    if (customType.trim() && !taskTypes.some(t => t.value === customType.trim().toLowerCase())) {
      setTaskTypes([
        ...taskTypes,
        { value: customType.trim().toLowerCase(), label: `✨ ${customType.trim()}` }
      ]);
      setFormData({ ...formData, type: customType.trim().toLowerCase() });
      setCustomType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { recurrence, date } = formData;
    const dateObj = new Date(date);

    if (recurrence !== "none" && recurrenceIntervals[recurrence]) {
      const { count, unit, step } = recurrenceIntervals[recurrence];
      for (let i = 0; i < count; i++) {
        const nextDate = new Date(dateObj);
        if (unit === 'day') {
          nextDate.setDate(dateObj.getDate() + i * step);
        } else if (unit === 'month') {
          nextDate.setMonth(dateObj.getMonth() + i * step);
        }
        await onAddTask({
          ...formData,
          date: nextDate.toISOString().split('T')[0],
          recurrence,
        });
      }
    } else {
      await onAddTask({ ...formData });
    }

    setFormData({
      title: '',
      description: '',
      time: '',
      type: 'feeding',
      pet_id: null,
      priority: 'medium',
      date: new Date().toISOString().split('T')[0],
      recurrence: 'none',
      completed: false
    });
    setCost('');

    onClose();
  };

  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, date: initialDate.toISOString().split('T')[0] }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialPet) {
      setFormData((prev) => ({ ...prev, pet_id: initialPet.id }));
    }
  }, [initialPet]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl mx-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-pet-primary text-lg">Add New Task</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="task" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-3xl">
            <TabsTrigger value="task" className="rounded-3xl">Task</TabsTrigger>
            <TabsTrigger value="cost" className="rounded-3xl">
              <DollarSign className="h-4 w-4 mr-1" />
              Cost
            </TabsTrigger>
            <TabsTrigger value="upgrade" className="rounded-3xl">
              <Crown className="h-4 w-4 mr-1" />
              Pro
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="task" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm">Task Info</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="rounded-2xl h-10"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="type" className="text-sm">Task Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    if (value === '__custom__') {
                      setShowCustomInput(true);
                      setTimeout(() => customInputRef.current?.focus(), 100);
                    } else {
                      setFormData({ ...formData, type: value });
                      setShowCustomInput(false);
                    }
                  }}
                >
                  <SelectTrigger className="rounded-2xl h-10">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl max-h-60 overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white/95 pb-1 mb-1 border-b border-muted-foreground/10">
                      <div className="font-semibold text-pet-primary px-3 py-2 text-sm">
                        Task Type
                      </div>
                    </div>
                    {taskTypes.map(t => (
                      <SelectItem key={t.value} value={t.value} className="flex items-center justify-between group">
                        <span>{t.label}</span>
                        {!defaultTaskTypes.some(dt => dt.value === t.value) && (
                          <button
                            type="button"
                            className="ml-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                            onClick={e => {
                              e.stopPropagation();
                              setTaskTypes(taskTypes.filter(tt => tt.value !== t.value));
                              if (formData.type === t.value) {
                                setFormData({ ...formData, type: defaultTaskTypes[0].value });
                              }
                            }}
                            tabIndex={-1}
                            aria-label="Remove custom type"
                          >
                            <Trash2 size={12}/>
                          </button>
                        )}
                      </SelectItem>
                    ))}
                    <div className="px-2 pt-2 border-t border-muted-foreground/10 bg-white sticky bottom-0 z-10">
                      {showCustomInput ? (
                        <div className="flex space-x-2">
                          <Input
                            ref={customInputRef}
                            value={customType}
                            onChange={e => setCustomType(e.target.value)}
                            placeholder="Add custom type"
                            className="rounded-xl h-9 flex-1 mb-1"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomType();
                                setShowCustomInput(false);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            className="rounded-2xl h-9 bg-pet-primary text-white"
                            onClick={() => {
                              handleAddCustomType();
                              setShowCustomInput(false);
                            }}
                            disabled={!customType.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full rounded-2xl h-9 text-pet-primary"
                          onClick={() => setShowCustomInput(true)}
                        >
                          + Add custom type
                        </Button>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select value={formData.pet_id || ''} onValueChange={(value) => setFormData({ ...formData, pet_id: value || null })}>
                  <SelectTrigger className="rounded-2xl h-10">
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {getSpeciesEmoji(pet.species)} {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="rounded-2xl h-10"
                  required
                />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="rounded-2xl h-10"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="recurrence" className="text-sm">Repeat</Label>
                <Select value={formData.recurrence} onValueChange={(value) => setFormData({ ...formData, recurrence: value })}>
                  <SelectTrigger className="rounded-2xl h-10">
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {recurrenceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="priority" className="text-sm">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="rounded-2xl h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟠 Medium</SelectItem>
                    <SelectItem value="low">🟡 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description..."
                  rows={2}
                  className="rounded-2xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-2xl h-10">
                  Cancel
                </Button>
                <Button type="submit" className="bg-pet-primary hover:bg-pet-primary/90 rounded-2xl h-10">
                  Add Task
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-4">
            <Card className="p-4 rounded-2xl">
              <h3 className="font-semibold mb-2 text-pet-primary">Pet Care Cost Tracker</h3>
              <p className="text-sm text-muted-foreground mb-4">Track expenses for this task</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cost" className="text-sm">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                    className="rounded-2xl h-10"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  💡 Tip: Track expenses to better understand your pet care budget
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="upgrade" className="space-y-4">
            <Card className="p-4 rounded-2xl border-2 border-pet-primary/20">
              <div className="text-center space-y-3">
                <Crown className="h-12 w-12 text-pet-primary mx-auto" />
                <h3 className="font-bold text-pet-primary">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock advanced features like cost tracking, detailed analytics, and unlimited pets
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <span>✨ Unlimited pets</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span>📊 Advanced analytics</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span>💰 Cost tracking</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span>🔔 Smart reminders</span>
                  </div>
                </div>
                <Button className="w-full bg-pet-primary hover:bg-pet-primary/90 rounded-2xl">
                  Upgrade Now - $4.99/month
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
