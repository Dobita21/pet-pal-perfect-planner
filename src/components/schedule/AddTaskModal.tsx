
import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
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
import type { Task, Pet } from '@/hooks/usePetData';

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   time: string;
//   type: "walk" | "feeding" | "medication" | "grooming" | "vet" | "play" | string;// <-- allow custom types
//   petName: string;
//   completed: boolean;
//   priority: 'high' | 'medium' | 'low';
//   date?: Date;
//   recurrence: string; // <-- add this line
// }

// interface Pet {
//   id: string;
//   name: string;
//   species: string;
//   breed: string;
//   age: string;
//   avatar: string;
// }

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
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
  '1day': { count: 14, unit: 'day', step: 1 },         // 2 weeks
  '3days': { count: 6, unit: 'day', step: 3 },         // 18 days
  '5days': { count: 6, unit: 'day', step: 5 },         // 30 days
  '7days': { count: 8, unit: 'day', step: 7 },         // 8 weeks
  '2weeks': { count: 6, unit: 'day', step: 14 },       // 12 weeks
  '1month': { count: 12, unit: 'month', step: 1 },     // 12 months
  '3months': { count: 4, unit: 'month', step: 3 },     // 1 year
  '6months': { count: 2, unit: 'month', step: 6 },     // 1 year
  '12months': { count: 2, unit: 'month', step: 12 },   // 2 years
  'monthly': { count: 12, unit: 'month', step: 1 },    // 12 months, same date
};

const AddTaskModal = ({ isOpen, onClose, onAddTask, pets, initialDate, initialPet }: AddTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    type: 'feeding' as string,
    petName: '',
    priority: 'medium' as Task['priority'],
    date: new Date(),
    recurrence: 'none'
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { recurrence, date } = formData;

    if (recurrence !== "none" && recurrenceIntervals[recurrence]) {
      const { count, unit, step } = recurrenceIntervals[recurrence];
      for (let i = 0; i < count; i++) {
        // Always base each new date off the original selected date
        const nextDate = new Date(date);
        if (unit === 'day') {
          nextDate.setDate(date.getDate() + i * step);
        } else if (unit === 'month') {
          nextDate.setMonth(date.getMonth() + i * step);
        }
        onAddTask({
          ...formData,
          date: nextDate,
          recurrence,
        });
      }
    } else {
      onAddTask({ ...formData });
    }

    setFormData({
      title: '',
      description: '',
      time: '',
      type: 'feeding',
      petName: '',
      priority: 'medium',
      date: new Date(),
      recurrence: 'none'
    });

    onClose();
  };

  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, date: initialDate }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, date: initialDate }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialPet) {
      setFormData((prev) => ({ ...prev, petName: initialPet.name }));
    }
  }, [initialPet]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl mx-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-pet-primary text-lg">Add New Task</DialogTitle>
        </DialogHeader>
        
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
            <Select value={formData.petName} onValueChange={(value) => setFormData({ ...formData, petName: value })}>
              <SelectTrigger className="rounded-2xl h-10">
                <SelectValue placeholder="Select pet" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.name}>
                    {getSpeciesEmoji(pet.species)} {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-2xl h-10",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({ ...formData, date })}
                  initialFocus
                  className="pointer-events-auto rounded-3xl"
                />
              </PopoverContent>
            </Popover>
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
              value={formData.description}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
