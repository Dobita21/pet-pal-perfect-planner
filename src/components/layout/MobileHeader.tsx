
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;
  showNotifications?: boolean;
  showProfile?: boolean;
}

const MobileHeader = ({ title, showNotifications = true, showProfile = true }: MobileHeaderProps) => {
  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-pet-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">🐾</span>
        </div>
        <h1 className="text-xl font-bold text-pet-primary">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {showNotifications && (
          <Button variant="ghost" size="sm" className="relative hover:bg-pet-background">
            <Bell className="h-5 w-5 text-pet-primary" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-pet-pink rounded-full"></span>
          </Button>
        )}
        {showProfile && (
          <Button variant="ghost" size="sm" className="hover:bg-pet-background">
            <User className="h-5 w-5 text-pet-primary" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
