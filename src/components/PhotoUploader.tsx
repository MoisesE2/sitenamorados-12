
"use client";
import type { FC } from 'react';
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUploadForm } from "@/components/forms/photo-upload-form";
import { Camera, Heart, FileImage, Trash2, AlertTriangle, ImageOff } from "lucide-react";
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMounted } from '@/hooks/useMounted';

export interface StoredImage {
  id: string;
  name: string; // Keep as string, handle empty string in display if necessary
  imageUrl: string; 
  uploadedAt: number;
}

const MAX_PHOTOS_IN_STORAGE = 8;
const MAX_PHOTOS_IN_PREVIEW = 8; // Can be same or different from storage limit

const PhotoUploader: FC = () => {
  const [storedPhotos, setStoredPhotos] = useLocalStorage<StoredImage[]>("amorDigitalPhotos", []);
  const [photosPreview, setPhotosPreview] = useState<StoredImage[]>([]);
  const { toast } = useToast();
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      // Filter out invalid photos (e.g. ones that might have empty imageUrl due to past bugs or partial saves)
      const validPhotos = storedPhotos.filter(photo => photo && photo.imageUrl && photo.imageUrl.trim() !== "");
      const sortedPhotos = [...validPhotos].sort((a, b) => b.uploadedAt - a.uploadedAt);
      setPhotosPreview(sortedPhotos.slice(0, MAX_PHOTOS_IN_PREVIEW));
    }
  }, [storedPhotos, mounted]);

  const handlePhotoAddedToDashboard = useCallback((imageUrl: string, aliasInput?: string) => {
    if (!imageUrl || imageUrl.trim() === "") {
      toast({
        title: "URL/Data Inválido",
        description: "A imagem não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }

    setStoredPhotos(prevPhotos => {
      // Ensure prevPhotos is an array
      const currentPhotos = Array.isArray(prevPhotos) ? prevPhotos : [];
      
      // Check for duplicates based on imageUrl
      if (currentPhotos.some(p => p.imageUrl === imageUrl)) {
        // console.log("Photo already exists, not adding duplicate:", imageUrl);
        return currentPhotos; 
      }

      const newPhoto: StoredImage = {
        id: crypto.randomUUID(), // crypto.randomUUID is fine client-side
        name: aliasInput?.trim() || `Momentos ${currentPhotos.length + 1}`,
        imageUrl: imageUrl,
        uploadedAt: Date.now(),
      };

      let updatedPhotos = [newPhoto, ...currentPhotos].sort((a, b) => b.uploadedAt - a.uploadedAt);

      if (updatedPhotos.length > MAX_PHOTOS_IN_STORAGE) {
        const removedCount = updatedPhotos.length - MAX_PHOTOS_IN_STORAGE;
        updatedPhotos = updatedPhotos.slice(0, MAX_PHOTOS_IN_STORAGE);
        toast({
          title: "Limite de Fotos Atingido",
          description: `${removedCount} foto(s) mais antiga(s) foram removida(s) para dar espaço.`,
          variant: "default",
          duration: 7000,
          action: (
            <div className="flex items-center text-xs">
              <AlertTriangle className="mr-1.5 h-4 w-4 text-yellow-500" />
              Aviso
            </div>
          ),
        });
      }
      return updatedPhotos;
    });
  }, [setStoredPhotos, toast]);

  const handleRemovePhoto = useCallback((photoId: string) => {
    setStoredPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
    toast({
      title: "Foto Removida",
      description: "A foto foi removida da sua galeria.",
    });
  }, [setStoredPhotos, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <Camera className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Nossos Momentos</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Carregue fotos do seu computador (máx. {MAX_PHOTOS_IN_STORAGE} mais recentes serão salvas localmente no navegador).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhotoUploadForm onPhotoAdded={handlePhotoAddedToDashboard} />
        
        {!mounted && ( 
           <div className="mt-6 text-center text-muted-foreground font-body py-6 px-4 border border-dashed rounded-md">
             <FileImage className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/50 mx-auto mb-2 animate-pulse" />
             <p>Carregando pré-visualização...</p>
           </div>
        )}

        {mounted && photosPreview.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-3">Pré-visualização ({photosPreview.length} mais recentes):</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {photosPreview.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden shadow-md group transition-all duration-300 hover:shadow-xl">
                  {photo.imageUrl && photo.imageUrl.trim() !== "" ? (
                    photo.imageUrl.startsWith('data:') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.imageUrl}
                        alt={photo.name || "Foto carregada"}
                        className="object-cover w-full h-full group-hover:opacity-80 transition-opacity duration-300"
                        data-ai-hint="uploaded couple"
                      />
                    ) : (
                      <Image
                        src={photo.imageUrl}
                        alt={photo.name || "Foto do casal"}
                        fill={true}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
                        className="object-cover group-hover:opacity-80 transition-opacity duration-300"
                        data-ai-hint="couple photo"
                        priority={photosPreview.indexOf(photo) < 2} // Prioritize first few images
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageOff className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1.5 right-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      onClick={() => handleRemovePhoto(photo.id)}
                      aria-label="Remover foto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-white/70 fill-white/40" />
                  </div>
                   <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    {photo.name || "Sem nome"}
                  </div>
                </div>
              ))}
            </div>
            {storedPhotos.filter(p => p && p.imageUrl && p.imageUrl.trim() !== "").length > photosPreview.length && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Mostrando as {photosPreview.length} mais recentes de {storedPhotos.filter(p => p && p.imageUrl && p.imageUrl.trim() !== "").length} fotos salvas.
              </p>
            )}
          </div>
        )}

        {mounted && photosPreview.length === 0 && (
          <div className="mt-6 text-center text-muted-foreground font-body py-6 px-4 border border-dashed rounded-md">
            <FileImage className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/50 mx-auto mb-2" />
            <p>Nenhuma foto carregada ainda.</p>
            <p className="text-xs mt-1">As fotos que você carregar aparecerão aqui e na página pública.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { PhotoUploader };
