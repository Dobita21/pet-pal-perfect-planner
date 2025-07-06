import React, { useState, useEffect } from 'react';

const imageFilenames = [
  '1.webp',
  '2.webp',
  '3.webp',
];

const sortedFilenames = imageFilenames.sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
  const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
  return numA - numB;
});

const imageList = sortedFilenames.map(name => `/images/carousel/${name}`);

const InfinityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (imageList.length === 0) return null;

  return (
    <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-white">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{
          width: `${imageList.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / imageList.length)}%)`,
        }}
      >
        {imageList.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            style={{
              width: `${100 / imageList.length}%`,
              height: '100%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageList.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-pet-primary' : 'bg-pet-primary/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InfinityCarousel;