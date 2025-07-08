
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pet } from '@/hooks/useSupabasePets';
import { Task } from '@/hooks/useSupabaseTasks';

interface ProfileTabProps {
  user: any;
  profile: any;
  pets: Pet[];
  tasks: Task[];
  setActiveTab: (tab: string) => void;
}

const ProfileTab = ({ user, profile, pets, tasks, setActiveTab }: ProfileTabProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Card className="p-6 text-center rounded-3xl">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
          Sign In
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-pet-primary/20 flex items-center justify-center text-4xl mx-auto mb-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            '👤'
          )}
        </div>
        <h2 className="text-xl font-bold text-pet-primary mb-2">{profile?.full_name || 'Pet Owner'}</h2>
        <p className="text-muted-foreground">{profile?.email}</p>
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            profile?.user_plan === 'premium' ? 'bg-yellow-100 text-yellow-800' :
            profile?.user_plan === 'pro' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {profile?.user_plan?.toUpperCase() || 'FREE'} Plan
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold mb-2 text-pet-primary">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Name</span>
              <span className="font-medium">{profile?.full_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span className="font-medium">{profile?.email || user.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Pets</span>
              <span className="font-medium">{pets.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold mb-2 text-pet-primary">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => setActiveTab('mypets')}
            >
              My Pets
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => navigate('/health')}
            >
              Health Records
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-2xl"
              onClick={() => setActiveTab('tasks')}
            >
              All Tasks
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileTab;
