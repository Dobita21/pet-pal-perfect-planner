
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
        <div className="w-8 h-8 rounded-full bg-pet-teal flex items-center justify-center">
          <span className="text-white font-bold text-sm">🐾</span>
        </div>
        <h1 className="text-xl font-bold text-pet-teal">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {showNotifications && (
          <Button variant="ghost" size="sm" className="relative hover:bg-pet-cream">
            <Bell className="h-5 w-5 text-pet-teal" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-pet-orange rounded-full"></span>
          </Button>
        )}
        {showProfile && (
          <Button variant="ghost" size="sm" className="hover:bg-pet-cream">
            <User className="h-5 w-5 text-pet-teal" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
