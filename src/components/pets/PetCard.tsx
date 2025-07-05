
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Card 
      className="p-4 pet-card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 bg-white rounded-3xl w-72 min-w-72"
      onClick={() => onSelect(pet)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-pet-primary/20 to-pet-secondary/20 flex items-center justify-center text-2xl">
            {getSpeciesEmoji(pet.species)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pet-primary rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-pet-primary truncate">{pet.name}</h3>
          <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age}</p>
          
          {pet.nextTask && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs bg-pet-secondary/10 text-pet-secondary rounded-2xl border-pet-secondary/20">
                {pet.nextTask.type} at {pet.nextTask.time}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
