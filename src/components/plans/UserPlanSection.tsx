
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Crown } from 'lucide-react';

const UserPlanSection = () => {
  const plans = [
    {
      id: 'pro',
      name: 'Pro',
      price: '49',
      currency: 'THB',
      icon: '⭐',
      features: ['Up to 10 pets', 'Advanced analytics', 'Vet appointments', 'Photo uploads', 'Sync to Google Calendar'],
      isPopular: true,
      buttonText: 'Upgrade',
      buttonVariant: 'default' as const
    },
    {
      id: 'pro-plus',
      name: 'Pro+',
      price: '99',
      currency: 'THB',
      icon: '👑',
      features: ['Unlimited pets', 'AI health insights', 'Priority support', 'Custom reminders', 'Sync to Google Calendar'],
      isPopular: false,
      buttonText: 'Upgrade',
      buttonVariant: 'default' as const
    },
    {
      id: 'free',
      name: 'Free',
      price: '0',
      currency: 'THB',
      icon: '🐾',
      features: ['Up to 2 pets', 'Basic task tracking', 'Health reminders'],
      isPopular: false,
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-4">      
      <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`min-w-[280px] p-6 rounded-3xl pet-card-shadow relative ${
              plan.isPopular ? 'border-pet-primary border-2' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-pet-primary text-white px-4 py-1 rounded-3xl text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{plan.icon}</div>
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-pet-primary">{plan.price}</span>
                <span className="text-sm text-muted-foreground"> {plan.currency}/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-pet-green flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              variant={plan.buttonVariant}
              className={`w-full rounded-3xl ${
                plan.buttonVariant === 'default' 
                  ? 'bg-pet-primary hover:bg-pet-primary/90' 
                  : 'border-pet-primary text-pet-primary hover:bg-pet-primary/10'
              }`}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Choose Your Plan</h2>
      </div>
    </div>
  );
};

export default UserPlanSection;
