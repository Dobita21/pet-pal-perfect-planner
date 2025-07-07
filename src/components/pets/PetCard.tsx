
import React from 'react';
import { Card } from '@/components/ui/card';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  avatar: string | null;
}

interface PetCardProps {
  pet: Pet;
  onSelect: (pet: Pet) => void;
}

const PetCard = ({ pet, onSelect }: PetCardProps) => {
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

  const isUploadedImage = pet.avatar && (pet.avatar.startsWith('data:') || pet.avatar.startsWith('http'));

  return (
    <Card 
      className="p-3 pet-card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 bg-white rounded-2xl min-w-72 w-full"
      onClick={() => onSelect(pet)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pet-primary/20 to-pet-secondary/20 flex items-center justify-center text-2xl overflow-hidden">
            {isUploadedImage ? (
              <img 
                src={pet.avatar} 
                alt={pet.name} 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              getSpeciesEmoji(pet.species)
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pet-primary rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-pet-primary truncate">{pet.name}</h3>
          <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age}</p>
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
