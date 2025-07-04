
import React from 'react';
import { Calendar, Heart, List, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'tasks', label: 'Tasks', icon: List },
  { id: 'profile', label: 'Profile', icon: User },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pet-cream px-4 py-2 safe-area-pb">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-pet-teal bg-pet-cream' 
                  : 'text-muted-foreground hover:text-pet-teal hover:bg-pet-cream/50'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-gentle' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
