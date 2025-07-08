
import React, { useState } from 'react';
import MobileHeader from '@/components/layout/MobileHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useSupabasePets } from '@/hooks/useSupabasePets';
import { useSupabaseHealthMetrics } from '@/hooks/useSupabaseHealthMetrics';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Activity, TrendingUp, TrendingDown, Minus, Menu, Upload, Camera, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Health = () => {
  const { user } = useAuth();
  const { pets } = useSupabasePets();
  const { healthMetrics, addHealthMetric } = useSupabaseHealthMetrics();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeTab, setActiveTab] = useState('health');
  
  const [newMetric, setNewMetric] = useState({
    title: '',
    customTitle: '',
    value: '',
    unit: '',
    status: 'good' as 'good' | 'warning' | 'critical',
    trend: 'stable' as 'stable' | 'up' | 'down'
  });

  const [vetRecord, setVetRecord] = useState({
    title: '',
    note: '',
    images: [] as File[]
  });

  const [healthNotes, setHealthNotes] = useState('');

  const [vaccines, setVaccines] = useState([
    { name: 'Rabies', completed: false, dueDate: '2024-08-15' },
    { name: 'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)', completed: true, dueDate: '2024-06-10' },
    { name: 'Bordetella', completed: false, dueDate: '2024-09-20' },
    { name: 'Lyme Disease', completed: false, dueDate: '2024-07-25' },
    { name: 'Canine Influenza', completed: true, dueDate: '2024-05-30' },
    { name: 'Feline Leukemia (FeLV)', completed: false, dueDate: '2024-08-05' },
    { name: 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)', completed: true, dueDate: '2024-04-15' }
  ]);

  const navigate = useNavigate();

  const defaultMetrics = [
    'Weight', 'Temperature', 'Heart Rate', 'Blood Pressure', 'Glucose Level', 
    'Medication Dosage', 'Exercise Duration', 'Food Intake', 'Water Intake', 'Other'
  ];

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
  const petHealthMetrics = healthMetrics.filter(metric => metric.pet_id === selectedPet);

  const handleAddRecord = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowAddModal(true);
  };

  const handleVetRecords = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowVetModal(true);
  };

  const handleVaccinations = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowVaccineModal(true);
  };

  const handleNotes = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowNotesModal(true);
  };

  const handleSubmitMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    try {
      const metricTitle = newMetric.title === 'Other' ? newMetric.customTitle : newMetric.title;
      
      await addHealthMetric({
        pet_id: selectedPet,
        title: metricTitle,
        value: newMetric.value,
        unit: newMetric.unit,
        status: newMetric.status,
        trend: newMetric.trend
      });

      setNewMetric({
        title: '',
        customTitle: '',
        value: '',
        unit: '',
        status: 'good',
        trend: 'stable'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding health metric:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setVetRecord(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setVetRecord(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleVaccine = (index: number) => {
    setVaccines(prev => prev.map((vaccine, i) => 
      i === index ? { ...vaccine, completed: !vaccine.completed } : vaccine
    ));
  };

  const saveVetRecord = () => {
    console.log('Saving vet record:', vetRecord);
    // TODO: Save to Supabase
    setShowVetModal(false);
    setVetRecord({ title: '', note: '', images: [] });
  };

  const saveHealthNotes = () => {
    console.log('Saving health notes:', healthNotes);
    // TODO: Save to Supabase
    setShowNotesModal(false);
  };

  const completedVaccines = vaccines.filter(v => v.completed).length;
  const totalVaccines = vaccines.length;
  const upcomingVaccines = vaccines.filter(v => !v.completed).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader 
          title="Health"
          onProfileClick={() => navigate('/signin')}
          onSignInClick={() => navigate('/signin')}
        />
        
        <main className="px-4 py-6 pb-24 animate-fade-in">
          <Card className="p-6 text-center rounded-3xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
            <p className="text-muted-foreground mb-4">Please sign in to view and manage your pets' health records</p>
            <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
              Sign In
            </Button>
          </Card>
        </main>
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="Health"
        onProfileClick={() => setActiveTab('profile')}
      />
      
      <main className="px-4 py-6 pb-24 animate-fade-in">
        <div className="space-y-6">
          {pets.length === 0 ? (
            <Card className="p-6 text-center rounded-3xl">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold mb-2">No Pets Yet</h3>
              <p className="text-muted-foreground mb-4">Add your first pet to start tracking their health</p>
              <Button onClick={() => setActiveTab('mypets')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
                Add Your First Pet
              </Button>
            </Card>
          ) : (
            <>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary/10">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white">
                      <DropdownMenuItem onClick={handleAddRecord}>
                        <Heart className="h-4 w-4 mr-2" />
                        Add Health Record
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleVetRecords}>
                        <Camera className="h-4 w-4 mr-2" />
                        Vet Records
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleVaccinations}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Vaccinations
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleNotes}>
                        <Activity className="h-4 w-4 mr-2" />
                        Notes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {petHealthMetrics.length === 0 ? (
                    <Card className="p-6 text-center rounded-2xl pet-card-shadow">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-muted-foreground">No health records yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Add your first health metric to get started</p>
                    </Card>
                  ) : (
                    petHealthMetrics.map(metric => (
                      <Card key={metric.id} className="p-4 rounded-2xl pet-card-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-pet-primary" />
                            <span className="font-medium text-pet-primary">{metric.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {getTrendIcon(metric.trend || 'stable')}
                            <Badge variant="outline" className={`text-xs rounded-xl ${getStatusColor(metric.status || 'good')}`}>
                              {metric.status || 'good'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-2xl font-bold text-pet-primary">{metric.value}</span>
                          <span className="text-sm text-muted-foreground">{metric.unit}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(metric.recorded_at || metric.created_at || '').toLocaleDateString()}
                        </p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Health Metric Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="w-[95vw] max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-pet-primary">Add Health Record</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitMetric} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metricType">Metric Name</Label>
              <Select value={newMetric.title} onValueChange={(value) => setNewMetric({ ...newMetric, title: value })}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  {defaultMetrics.map((metric) => (
                    <SelectItem key={metric} value={metric}>{metric}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newMetric.title === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="customTitle">Custom Metric Name</Label>
                <Input
                  id="customTitle"
                  value={newMetric.customTitle}
                  onChange={(e) => setNewMetric({ ...newMetric, customTitle: e.target.value })}
                  placeholder="Enter custom metric name"
                  className="rounded-2xl"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                  placeholder="e.g. 25.5"
                  className="rounded-2xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
                  placeholder="e.g. lbs, °F"
                  className="rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newMetric.status} onValueChange={(value: 'good' | 'warning' | 'critical') => setNewMetric({ ...newMetric, status: value })}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">✅ Good</SelectItem>
                    <SelectItem value="warning">⚠️ Warning</SelectItem>
                    <SelectItem value="critical">🚨 Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trend">Trend</Label>
                <Select value={newMetric.trend} onValueChange={(value: 'stable' | 'up' | 'down') => setNewMetric({ ...newMetric, trend: value })}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">📈 Improving</SelectItem>
                    <SelectItem value="stable">➡️ Stable</SelectItem>
                    <SelectItem value="down">📉 Declining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-pet-primary hover:bg-pet-primary/90 rounded-2xl">
                Add Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vet Records Modal */}
      <Dialog open={showVetModal} onOpenChange={setShowVetModal}>
        <DialogContent className="w-[95vw] max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-pet-primary">Vet Records</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vetTitle">Record Title</Label>
              <Input
                id="vetTitle"
                value={vetRecord.title}
                onChange={(e) => setVetRecord({ ...vetRecord, title: e.target.value })}
                placeholder="e.g. Annual Checkup, Surgery, etc."
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vetNote">Notes</Label>
              <Textarea
                id="vetNote"
                value={vetRecord.note}
                onChange={(e) => setVetRecord({ ...vetRecord, note: e.target.value })}
                placeholder="Add any notes about this vet visit..."
                className="rounded-2xl min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('vet-image-upload')?.click()}
                    className="rounded-2xl"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                  <input
                    id="vet-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {vetRecord.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vetRecord.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Vet record ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowVetModal(false)} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="button" onClick={saveVetRecord} className="bg-pet-primary hover:bg-pet-primary/90 rounded-2xl">
                Save Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vaccinations Modal */}
      <Dialog open={showVaccineModal} onOpenChange={setShowVaccineModal}>
        <DialogContent className="w-[95vw] max-w-md rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-pet-primary">Vaccinations</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary */}
            <Card className="p-4 rounded-2xl bg-pet-primary/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-pet-primary">Vaccination Summary</span>
                <Badge variant="outline" className="bg-pet-green/10 text-pet-green border-pet-green/20">
                  {completedVaccines}/{totalVaccines} Complete
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Completed: {completedVaccines}</span>
                  <span>Upcoming: {upcomingVaccines}</span>
                </div>
              </div>
            </Card>

            {/* Vaccine List */}
            <div className="space-y-3">
              {vaccines.map((vaccine, index) => (
                <Card key={index} className="p-3 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={vaccine.completed}
                      onCheckedChange={() => toggleVaccine(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${vaccine.completed ? 'text-pet-green' : 'text-pet-primary'}`}>
                          {vaccine.name}
                        </span>
                        {vaccine.completed ? (
                          <CheckCircle className="h-4 w-4 text-pet-green" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-pet-orange" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vaccine.completed ? 'Completed' : `Due: ${vaccine.dueDate}`}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowVaccineModal(false)} className="bg-pet-primary hover:bg-pet-primary/90 rounded-2xl">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="w-[95vw] max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-pet-primary">Health Notes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              placeholder="Add general health notes for your pet..."
              className="rounded-2xl min-h-[120px]"
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowNotesModal(false)} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="button" onClick={saveHealthNotes} className="bg-pet-primary hover:bg-pet-primary/90 rounded-2xl">
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Health;
