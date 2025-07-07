
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: any) => Promise<void>;
}

const AddPetModal = ({ isOpen, onClose, onAddPet }: AddPetModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    notes: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate year and month options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => `${currentYear - i}`);
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

  // Calculate days in month for the selected year and month
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return 31;
    return new Date(Number(year), Number(month), 0).getDate();
  };
  const daysInMonth = getDaysInMonth(birthYear, birthMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`.padStart(2, '0'));

  // Calculate age from birth date
  const calculateAge = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return '';
    
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age === 0) {
      const monthsOld = monthDifference < 0 ? 12 + monthDifference : monthDifference;
      return monthsOld <= 1 ? `${monthsOld} month` : `${monthsOld} months`;
    }
    
    return age === 1 ? '1 year' : `${age} years`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      onClose();
      navigate('/signin');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const calculatedAge = calculateAge(birthYear, birthMonth, birthDay);
      
      const newPet = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: calculatedAge,
        avatar: uploadedImage,
        notes: formData.notes
      };

      await onAddPet(newPet);
      
      // Reset form
      setFormData({ name: '', species: '', breed: '', notes: '' });
      setUploadedImage(null);
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
      onClose();
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] w-[95%] max-h-[95vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-pet-primary">Add New Pet</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <div className="flex flex-col items-center space-y-3">
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Pet preview" 
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-pet-primary/20"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-pet-primary/30 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-pet-primary/50" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="pet-image"
                />
                <Label 
                  htmlFor="pet-image" 
                  className="cursor-pointer inline-flex items-center px-3 py-2 bg-pet-primary/10 text-pet-primary rounded-3xl text-sm hover:bg-pet-primary/20 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter pet's name"
              className="rounded-3xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Select value={formData.species} onValueChange={(value) => setFormData({ ...formData, species: value })}>
                <SelectTrigger className="rounded-3xl">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog 🐕</SelectItem>
                  <SelectItem value="cat">Cat 🐱</SelectItem>
                  <SelectItem value="bird">Bird 🦜</SelectItem>
                  <SelectItem value="fish">Fish 🐠</SelectItem>
                  <SelectItem value="rabbit">Rabbit 🐰</SelectItem>
                  <SelectItem value="other">Other 🐾</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Enter breed"
                className="rounded-3xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex space-x-2">
              <Select value={birthYear} onValueChange={value => { setBirthYear(value); setBirthDay(''); }}>
                <SelectTrigger className="rounded-3xl w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthMonth} onValueChange={value => { setBirthMonth(value); setBirthDay(''); }}>
                <SelectTrigger className="rounded-3xl w-full">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthDay} onValueChange={setBirthDay} disabled={!birthYear || !birthMonth}>
                <SelectTrigger className="rounded-3xl w-full">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special notes about your pet..."
              className="rounded-3xl"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-3xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetModal;
