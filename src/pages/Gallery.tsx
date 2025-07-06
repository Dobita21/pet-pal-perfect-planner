import React, { useRef, useState } from 'react';
import { useParams, useLocation } from "react-router-dom";

interface PetPhoto {
  id: string;
  url: string;
}

interface GalleryProps {
  petId: string;
  petName: string;
}

const Gallery: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const location = useLocation();
  const petName = (location.state as { petName?: string })?.petName || "Pet";

  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: PetPhoto[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push({
            id: `${Date.now()}-${file.name}`,
            url: event.target.result as string,
          });
          // Only update state after all files are read
          if (newPhotos.length === files.length) {
            setPhotos((prev) => [...prev, ...newPhotos]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{petName}'s Gallery</h2>
      <button
        className="mb-4 px-4 py-2 bg-pet-primary text-white rounded"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Photos
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="Pet"
            className="w-full h-24 object-cover rounded"
          />
        ))}
      </div>
      {photos.length === 0 && (
        <p className="text-muted-foreground mt-4">No photos uploaded yet.</p>
      )}
    </div>
  );
};

export default Gallery;