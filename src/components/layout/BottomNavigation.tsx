
import React from 'react';
import { Calendar, Heart, List, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'schedule', label: 'Home', icon: Calendar },
  { id: 'health', label: 'Schedule', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: List },
  { id: 'mypets', label: 'My Pets', icon: User },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pet-background px-4 py-2 safe-area-pb rounded-t-3xl">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-pet-primary bg-pet-background' 
                  : 'text-muted-foreground hover:text-pet-primary hover:bg-pet-background/50'
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
