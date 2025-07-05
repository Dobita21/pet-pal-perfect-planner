
import React, { useState, useEffect } from 'react';

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
}

const carouselItems: CarouselItem[] = [
  { id: '1', title: 'Find Your Best Friend', subtitle: 'Start your journey with your beloved pets', emoji: '🐕', color: 'from-pet-primary to-pet-secondary' },
  { id: '2', title: 'Health Tracking', subtitle: 'Monitor your pet\'s health and wellness', emoji: '❤️', color: 'from-pet-secondary to-pet-primary' },
  { id: '3', title: 'Daily Care', subtitle: 'Never miss feeding time or walks', emoji: '🍽️', color: 'from-pet-primary to-pet-blue' },
  { id: '4', title: 'Vet Appointments', subtitle: 'Keep track of medical visits', emoji: '🏥', color: 'from-pet-blue to-pet-primary' },
  { id: '5', title: 'Play & Exercise', subtitle: 'Fun activities for happy pets', emoji: '🎾', color: 'from-pet-secondary to-pet-primary' },
];

const InfinityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 rounded-3xl overflow-hidden mb-6">
      {/* Slider container */}
      <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" 
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`min-w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center px-8 relative`}
          >
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="text-center text-white relative z-10">
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <p className="text-lg opacity-90">{item.subtitle}</p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4">
              <span className="text-4xl opacity-60">🐾</span>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="text-2xl opacity-60">✨</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InfinityCarousel;
