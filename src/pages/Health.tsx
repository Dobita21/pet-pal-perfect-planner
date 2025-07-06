
import React, { useState } from 'react';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePetData } from '@/hooks/usePetData';
import { Heart, Activity, TrendingUp, TrendingDown, Minus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Health = () => {
  const { pets, healthMetrics } = usePetData();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const navigate = useNavigate();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-pet-green/10 text-pet-green border-pet-green/20';
      case 'warning': return 'bg-pet-orange/10 text-pet-primary border-pet-orange/20';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-pet-green" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-destructive" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const selectedPetData = pets.find(pet => pet.id === selectedPet);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="Health"
        onProfileClick={() => navigate('/profile')}
        isSignedIn={true}
      />
      
      <main className="px-4 py-6 pb-24 animate-fade-in">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold text-pet-primary">Health Records</h2>
            <div></div>
          </div>

          {/* Pet Selection */}
          {pets.length > 1 && (
            <div>
              <h3 className="font-semibold mb-3 text-pet-primary">Select Pet</h3>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {pets.map(pet => (
                  <Button
                    key={pet.id}
                    variant={selectedPet === pet.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPet(pet.id)}
                    className={`rounded-2xl flex-shrink-0 ${
                      selectedPet === pet.id 
                        ? 'bg-pet-primary text-white' 
                        : 'border-pet-primary text-pet-primary hover:bg-pet-primary/10'
                    }`}
                  >
                    <span className="mr-2">{getSpeciesEmoji(pet.species)}</span>
                    {pet.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Health Metrics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-pet-primary flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Health Metrics
              </h3>
              <Button size="sm" variant="outline" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                + Add Record
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {healthMetrics.map(metric => (
                <Card key={metric.id} className="p-4 rounded-2xl pet-card-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-pet-primary" />
                      <span className="font-medium text-pet-primary">{metric.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <Badge variant="outline" className={`text-xs rounded-xl ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-pet-primary">{metric.value}</span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">Last updated: {metric.lastUpdated}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3 text-pet-primary">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                📊 View Charts
              </Button>
              <Button variant="outline" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                🏥 Vet Records
              </Button>
              <Button variant="outline" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                💉 Vaccinations
              </Button>
              <Button variant="outline" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                💊 Medications
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation activeTab="health" onTabChange={() => {}} />
    </div>
  );
};

export default Health;
