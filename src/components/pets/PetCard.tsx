
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

  const isUploadedImage = pet.avatar && (pet.avatar.startsWith('data:') || pet.avatar.startsWith('http') || pet.avatar.startsWith('/'));

  return (
    <Card 
      className="p-4 pet-card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 bg-white rounded-3xl w-40 h-48 flex flex-col items-center text-center"
      onClick={() => onSelect(pet)}
    >
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-pet-primary/20 to-pet-secondary/20 flex items-center justify-center">
          {isUploadedImage ? (
            <img 
              src={pet.avatar} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">{getSpeciesEmoji(pet.species)}</span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pet-primary rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs text-white">✓</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-between w-full">
        <div>
          <h3 className="font-bold text-lg text-pet-primary truncate mb-1">{pet.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{pet.breed}</p>
        </div>
        
        {pet.nextTask && (
          <Badge variant="secondary" className="text-xs bg-pet-secondary/10 text-pet-secondary rounded-2xl border-pet-secondary/20 w-full">
            {pet.nextTask.type}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default PetCard;
