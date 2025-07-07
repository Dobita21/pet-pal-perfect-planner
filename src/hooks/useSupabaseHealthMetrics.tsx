
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface HealthMetric {
  id: string;
  pet_id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable' | null;
  status: 'good' | 'warning' | 'critical' | null;
  recorded_at: string;
  created_at: string;
}

export const useSupabaseHealthMetrics = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHealthMetrics = async () => {
    if (!user) {
      setHealthMetrics([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select(`
          *,
          pets!inner(user_id)
        `)
        .eq('pets.user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setHealthMetrics(data || []);
    } catch (error: any) {
      console.error('Error fetching health metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load health metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHealthMetric = async (metricData: Omit<HealthMetric, 'id' | 'created_at' | 'recorded_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert([metricData])
        .select()
        .single();

      if (error) throw error;
      
      setHealthMetrics(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Health metric added successfully!",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding health metric:', error);
      toast({
        title: "Error",
        description: "Failed to add health metric",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchHealthMetrics();
  }, [user]);

  return {
    healthMetrics,
    loading,
    addHealthMetric,
    refetch: fetchHealthMetrics
  };
};
