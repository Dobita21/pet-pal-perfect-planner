
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;  
  showNotifications?: boolean;
  showProfile?: boolean;
  onProfileClick?: () => void;
  onSignInClick?: () => void;
  isSignedIn?: boolean;
}

const MobileHeader = ({ 
  title, 
  showNotifications = true, 
  showProfile = true, 
  onProfileClick, 
  onSignInClick,
  isSignedIn = false 
}: MobileHeaderProps) => {
  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm rounded-b-2xl">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-2xl bg-pet-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">🐾</span>
        </div>
        <h1 className="text-xl font-bold text-pet-primary">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {!isSignedIn ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-2xl border-pet-primary text-pet-primary hover:bg-pet-primary hover:text-white"
            onClick={onSignInClick}
          >
            Sign In
          </Button>
        ) : (
          <>
            {showNotifications && (
              <Button variant="ghost" size="sm" className="relative hover:bg-pet-background rounded-2xl">
                <Bell className="h-5 w-5 text-pet-primary" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-pet-orange rounded-full"></span>
              </Button>
            )}
            {showProfile && (
              <Button variant="ghost" size="sm" className="hover:bg-pet-background rounded-2xl" onClick={onProfileClick}>
                <User className="h-5 w-5 text-pet-primary" />
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
