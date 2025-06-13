"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUploadForm } from "@/components/forms/photo-upload-form";
import { Camera, Heart } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  alt: string;
}

const PhotoGallerySection = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handlePhotoAdded = (url: string, file: File) => {
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      url: url,
      alt: file.name || "Foto do casal",
    };
    setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
  };

  return (
    <Card className="shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Camera className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl text-primary">Nossos Momentos</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Compartilhe as fotos mais especiais de vocês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhotoUploadForm onPhotoAdded={handlePhotoAdded} />
        {photos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-headline text-secondary-foreground mb-6 text-center">Galeria de Fotos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden shadow-md group transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <Image 
                    src={photo.url} 
                    alt={photo.alt} 
                    layout="fill" 
                    objectFit="cover" 
                    className="group-hover:opacity-80 transition-opacity duration-300"
                    data-ai-hint="couple romance"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Heart className="w-12 h-12 text-white/80 fill-white/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {photos.length === 0 && (
           <div className="mt-8 text-center text-muted-foreground font-body">
             <p>Nenhuma foto adicionada ainda. Comece a compartilhar seus momentos!</p>
             <Image 
                src="https://placehold.co/600x400.png?text=Amor+em+Fotos" 
                alt="Placeholder para galeria de fotos" 
                width={600} 
                height={400}
                className="mx-auto mt-4 rounded-lg shadow-sm opacity-50"
                data-ai-hint="love heart"
              />
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallerySection;
