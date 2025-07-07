
import React from 'react';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface EmptyPetCardProps {
  onAddPet: () => void;
}

const EmptyPetCard = ({ onAddPet }: EmptyPetCardProps) => {
  return (
    <Card 
      className="p-6 pet-card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 bg-white rounded-2xl min-w-72 w-full border-2 border-dashed border-pet-primary/30"
      onClick={onAddPet}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-16 h-16 rounded-xl bg-pet-primary/10 flex items-center justify-center">
          <Plus className="h-8 w-8 text-pet-primary" />
        </div>
        
        <div>
          <h3 className="font-semibold text-base text-pet-primary mb-1">Add Your First Pet</h3>
          <p className="text-sm text-muted-foreground">
            Get started by adding your furry, feathered, or finned friend!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyPetCard;
