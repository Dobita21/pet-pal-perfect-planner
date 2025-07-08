
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Trash2, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PetPhoto {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

const Gallery: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const petName = (location.state as { petName?: string })?.petName || "Pet";

  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    if (!user || !petId) return;

    try {
      const { data, error } = await supabase.storage
        .from('pet-photos')
        .list(`${user.id}/${petId}`, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const photosWithUrls: PetPhoto[] = [];
      
      for (const file of data) {
        const { data: urlData } = supabase.storage
          .from('pet-photos')
          .getPublicUrl(`${user.id}/${petId}/${file.name}`);
        
        photosWithUrls.push({
          id: file.id,
          url: urlData.publicUrl,
          name: file.name,
          created_at: file.created_at || new Date().toISOString()
        });
      }

      setPhotos(photosWithUrls);
    } catch (error: any) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || !petId) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${petId}/${fileName}`;

        const { error } = await supabase.storage
          .from('pet-photos')
          .upload(filePath, file);

        if (error) throw error;
        return fileName;
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: "Success",
        description: `${files.length} photo(s) uploaded successfully!`,
      });

      // Refresh photos
      fetchPhotos();
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoName: string) => {
    if (!user || !petId) return;

    try {
      const { error } = await supabase.storage
        .from('pet-photos')
        .remove([`${user.id}/${petId}/${photoName}`]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

      // Refresh photos
      fetchPhotos();
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download photo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchPhotos();
  }, [user, petId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 text-center rounded-3xl">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in to view photos</p>
          <Button onClick={() => navigate('/signin')} className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-pet-primary">{petName}'s Gallery</h1>
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building {petName}'s photo gallery by uploading your first picture!
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-pet-primary hover:bg-pet-primary/90 rounded-3xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload First Photo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="group relative overflow-hidden rounded-2xl">
                <img
                  src={photo.url}
                  alt={`${petName} photo`}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(photo.url, photo.name)}
                      className="rounded-2xl"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.name)}
                      className="rounded-2xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs">
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
