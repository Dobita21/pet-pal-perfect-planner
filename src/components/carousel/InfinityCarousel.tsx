
import React from 'react';

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
}

const carouselItems: CarouselItem[] = [
  { id: '1', title: 'Find Your Best Friend', subtitle: 'Start your journey with your beloved pets', emoji: '🐕' },
  { id: '2', title: 'Health Tracking', subtitle: 'Monitor your pet\'s health and wellness', emoji: '❤️' },
  { id: '3', title: 'Daily Care', subtitle: 'Never miss feeding time or walks', emoji: '🍽️' },
  { id: '4', title: 'Vet Appointments', subtitle: 'Keep track of medical visits', emoji: '🏥' },
  { id: '5', title: 'Play & Exercise', subtitle: 'Fun activities for happy pets', emoji: '🎾' },
];

const InfinityCarousel = () => {
  return (
    <div className="relative h-48 rounded-2xl overflow-hidden pet-gradient mb-6">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Infinity scroll container */}
      <div className="absolute inset-0 flex">
        <div className="flex carousel-slide">
          {[...carouselItems, ...carouselItems].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="min-w-full h-full flex items-center justify-center px-8"
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                <p className="text-lg opacity-90">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4">
        <span className="text-4xl">🐾</span>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="text-2xl">✨</span>
      </div>
    </div>
  );
};

export default InfinityCarousel;
