
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';

interface Pet {
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

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
}

const AddPetModal = ({ isOpen, onClose, onAddPet }: AddPetModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    notes: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPet = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      avatar: uploadedImage || getSpeciesEmoji(formData.species)
    };

    onAddPet(newPet);
    setFormData({ name: '', species: '', breed: '', age: '', notes: '' });
    setUploadedImage(null);
    onClose();
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
      <DialogContent className="sm:max-w-md max-w-[90vw] w-[80%] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-pet-primary">Add New Pet</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Pet Photo</Label>
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
            <Label htmlFor="name">Pet Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter pet's name"
              className="rounded-3xl"
              required
            />
          </div>

          {/* Species and Breed in same row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
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
              <Label htmlFor="breed">Breed</Label>
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
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g., 2 years, 6 months"
              className="rounded-3xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
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
            <Button type="submit" className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
              Add Pet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetModal;
