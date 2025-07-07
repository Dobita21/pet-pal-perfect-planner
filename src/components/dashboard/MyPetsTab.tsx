
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/pets/PetCard';
import EmptyPetCard from '@/components/pets/EmptyPetCard';
import { Pet } from '@/hooks/useSupabaseTasks';

interface MyPetsTabProps {
  user: any;
  pets: Pet[];
  onAddPet: () => void;
  onPetSelect: (pet: Pet) => void;
}

const MyPetsTab = ({ user, pets, onAddPet, onPetSelect }: MyPetsTabProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Card className="p-6 text-center rounded-3xl">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">Please sign in to view and manage your pets</p>
        <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
          Sign In
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All My Pets</h2>
        <Button 
          size="sm" 
          className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl" 
          onClick={onAddPet}
        >
          + Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyPetCard onAddPet={onAddPet} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onSelect={onPetSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPetsTab;
