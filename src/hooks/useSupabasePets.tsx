
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  avatar: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useSupabasePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPets = async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      console.error('Error fetching pets:', error);
      toast({
        title: "Error",
        description: "Failed to load pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{
          ...petData,
          user_id: user.id,
          avatar: petData.avatar || getSpeciesEmoji(petData.species)
        }])
        .select()
        .single();

      if (error) throw error;
      
      setPets(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: `${data.name} has been added to your pets!`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding pet:', error);
      toast({
        title: "Error",
        description: "Failed to add pet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setPets(prev => prev.map(pet => pet.id === petId ? data : pet));
      toast({
        title: "Success",
        description: "Pet updated successfully!",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating pet:', error);
      toast({
        title: "Error",
        description: "Failed to update pet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePet = async (petId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setPets(prev => prev.filter(pet => pet.id !== petId));
      toast({
        title: "Success",
        description: "Pet removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting pet:', error);
      toast({
        title: "Error",
        description: "Failed to remove pet",
        variant: "destructive",
      });
      throw error;
    }
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

  useEffect(() => {
    fetchPets();
  }, [user]);

  return {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    refetch: fetchPets
  };
};
