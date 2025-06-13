
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Edit, Heart, ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaylistEmbedder } from "@/components/PlaylistEmbedder";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useMounted } from "@/hooks/useMounted";
import type { StoredImage } from "@/components/PhotoUploader"; 
import type { NameDisplayPreference } from "@/components/dashboard/NameDisplayPreferenceEditor";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

interface ServerPreferences {
  anniversaryDate: string | null;
  playlistUrl: string | null;
  definingPhrase: string | null;
  coupleNames: [string, string] | null;
  nameDisplayPreference: NameDisplayPreference;
  theme: 'light' | 'dark';
}

const defaultPreferences: ServerPreferences = {
  anniversaryDate: null,
  playlistUrl: null,
  definingPhrase: "",
  coupleNames: ["Você", "Seu Amor"],
  nameDisplayPreference: "both",
  theme: "light",
};

// Define local images for the carousel
const localCarouselImages: StoredImage[] = [
  { id: 'image-1', name: 'Imagem 1', imageUrl: '/assets/image-1.jpg', uploadedAt: 0, hint: "love couple" },
  { id: 'image-2', name: 'Imagem 2', imageUrl: '/assets/image-2.jpg', uploadedAt: 0, hint: "romance nature" },
  { id: 'image-3', name: 'Imagem 3', imageUrl: '/assets/image-3.jpg', uploadedAt: 0, hint: "happy moment" },
  { id: 'image-4', name: 'Imagem 4', imageUrl: '/assets/image-4.jpg', uploadedAt: 0, hint: "celebration fun" },
  { id: 'image-5', name: 'Imagem 5', imageUrl: '/assets/image-5.jpg', uploadedAt: 0, hint: "adventure travel" },
  { id: 'image-6', name: 'Imagem 6', imageUrl: '/assets/image-6.jpg', uploadedAt: 0, hint: "cozy home" },
  { id: 'image-7', name: 'Imagem 7', imageUrl: '/assets/image-7.jpg', uploadedAt: 0, hint: "special date" },
];


const AnniversaryTextView: React.FC<{ anniversaryDate: string | null }> = ({ anniversaryDate }) => {
  const [durationText, setDurationText] = useState<string>("Carregando tempo juntos...");
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (!anniversaryDate) {
      setDurationText("Por favor, defina a data do aniversário no dashboard.");
      return;
    }

    const calculateDuration = () => {
      const startDate = new Date(anniversaryDate);
      if (isNaN(startDate.getTime())) {
        setDurationText("Data do aniversário inválida.");
        return;
      }
      const now = new Date();
      if (now < startDate) {
        setDurationText("Nosso tempo especial ainda vai começar!");
        return;
      }

      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      
      if (days < 0) {
        const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthDays;
        months--;
      }
      if (months < 0) { months += 12; years--; }
      
      if (years < 0) { 
        setDurationText("Ainda estamos para começar nossa jornada!");
        return;
      }

      const parts = [];
      if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
      if (months > 0) parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
      if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
      
      if (parts.length === 0 && startDate <= now) {
         setDurationText("Eu te amo há alguns segundos!"); 
      } else if (parts.length > 0) {
         setDurationText(`Eu te amo há ${parts.join(', ')}.`);
      } else {
         setDurationText("Calculando nosso tempo juntos..."); 
      }
    };

    calculateDuration();
    const intervalId = setInterval(calculateDuration, 60000); 
    return () => clearInterval(intervalId);
  }, [anniversaryDate, mounted]);

  return <p className="text-center text-lg md:text-xl text-foreground">{durationText}</p>;
};

const PhotoCarouselView: React.FC<{ images: StoredImage[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useMounted();

  // The 'images' prop will now be localCarouselImages
  const validImages = useMemo(() => {
    if (!mounted) return []; 
    // Filter out any potential invalid entries, though localCarouselImages should be well-defined
    return images.filter(img => img && img.imageUrl && img.imageUrl.trim() !== "");
  }, [images, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (validImages.length > 0 && currentIndex >= validImages.length) {
      setCurrentIndex(0);
    } else if (validImages.length === 0 && currentIndex !== 0) {
      setCurrentIndex(0);
    }
  }, [validImages, currentIndex, mounted]);


  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center bg-card p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm aspect-[3/4]">
        <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
         <p className="mt-3 text-sm text-center text-muted-foreground">Carregando fotos...</p>
      </div>
    );
  }

  if (validImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-card p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm aspect-[3/4]">
        <Image
          src="https://placehold.co/300x400.png" 
          alt="Nenhuma imagem local configurada"
          width={300}
          height={400}
          className="rounded-md object-contain"
          data-ai-hint="placeholder empty"
        />
        <p className="mt-3 text-sm text-center text-muted-foreground">Configure as imagens locais em /public/assets.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? validImages.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === validImages.length - 1 ? 0 : prevIndex + 1));
  };

  const currentImage = validImages[currentIndex]; 

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm flex flex-col items-center group">
      <Card className="w-full bg-card text-card-foreground border-border p-3 md:p-4 rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300">
        <div className="aspect-[3/4] w-full relative overflow-hidden rounded-md bg-muted">
          {currentImage && currentImage.imageUrl ? ( 
            <Image
              key={currentImage.id || currentIndex} 
              src={currentImage.imageUrl} 
              alt={currentImage.name || "Lembrança do casal"}
              fill={true}
              className="object-cover transition-opacity duration-500 ease-in-out"
              data-ai-hint={currentImage.hint || "couple love"}
              sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 33vw"
              priority={currentIndex === 0} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </Card>
      {validImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-[-20px] sm:left-[-35px] md:left-[-50px] top-1/2 -translate-y-1/2 transform bg-card/40 hover:bg-card/70 text-card-foreground rounded-full backdrop-blur-sm shadow-md"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-[-20px] sm:right-[-35px] md:right-[-50px] top-1/2 -translate-y-1/2 transform bg-card/40 hover:bg-card/70 text-card-foreground rounded-full backdrop-blur-sm shadow-md"
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default function PublicViewPage() {
  const [preferences, setPreferences] = useState<ServerPreferences | null>(null);
  const [isLoadingPagePrefs, setIsLoadingPagePrefs] = useState(true);
  const mounted = useMounted();
  
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    if (!mounted) return;

    const fetchPreferences = async () => {
      setIsLoadingPagePrefs(true);
      try {
        const response = await fetch('/api/preferences', { cache: 'no-store' }); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ServerPreferences = await response.json();
        setPreferences(data);
        if (data.theme && data.theme !== localStorageTheme) {
          setLocalStorageTheme(data.theme);
        }
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(data.theme || localStorageTheme);

      } catch (error) {
        console.error("Failed to load preferences for public page:", error);
        setPreferences(defaultPreferences); 
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(localStorageTheme);
      } finally {
        setIsLoadingPagePrefs(false);
      }
    };

    fetchPreferences();
  }, [mounted, localStorageTheme, setLocalStorageTheme]);


  if (!mounted || isLoadingPagePrefs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        Carregando página...
      </div>
    );
  }
  
  const currentPrefs = preferences || defaultPreferences;
  const displayCoupleNames: [string, string] = currentPrefs.coupleNames || defaultPreferences.coupleNames || ["Você", "Seu Amor"];
  const nameDisplayPreference = currentPrefs.nameDisplayPreference || defaultPreferences.nameDisplayPreference;
  const definingPhrase = currentPrefs.definingPhrase || defaultPreferences.definingPhrase;
  const anniversaryDate = currentPrefs.anniversaryDate || defaultPreferences.anniversaryDate;
  const playlistUrl = currentPrefs.playlistUrl || defaultPreferences.playlistUrl;

  let headerContent;
  if (nameDisplayPreference === 'user1') {
    headerContent = (
      <span className="flex items-center justify-center">
        {displayCoupleNames[0]}
        <Heart className="ml-2 h-7 w-7 sm:h-8 sm:w-8 text-primary inline-block fill-current" />
      </span>
    );
  } else if (nameDisplayPreference === 'user2') {
    headerContent = (
      <span className="flex items-center justify-center">
        {displayCoupleNames[1]}
        <Heart className="ml-2 h-7 w-7 sm:h-8 sm:w-8 text-primary inline-block fill-current" />
      </span>
    );
  } else { 
    headerContent = (
      <>
        {displayCoupleNames[0]} <span className="text-primary mx-1 sm:mx-2">&amp;</span> {displayCoupleNames[1]}
      </>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-12 md:space-y-16 bg-background text-foreground font-body">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <ThemeSwitcher serverTheme={currentPrefs.theme} />
      </div>

      <header className="text-center mt-16 sm:mt-12">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
          {headerContent}
        </h1>
      </header>

      <section className="w-full flex justify-center px-2">
        {/* Pass local images to the carousel view */}
        <PhotoCarouselView images={localCarouselImages} />
      </section>

      <section className="w-full max-w-2xl px-2">
        <AnniversaryTextView anniversaryDate={anniversaryDate} />
      </section>
      
      {playlistUrl && (
        <section className="w-full max-w-xl md:max-w-2xl space-y-3 sm:space-y-4 text-center px-2">
          <h2 className="font-headline text-2xl sm:text-3xl text-foreground">Nossa Trilha Sonora</h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <PlaylistEmbedder isPublicView={true} initialPlaylistUrl={playlistUrl} /> 
          </div>
        </section>
      )}

      {definingPhrase && definingPhrase.trim() !== "" && (
        <section className="w-full max-w-xl md:max-w-2xl space-y-3 sm:space-y-4 text-center px-2">
          <h2 className="font-headline text-2xl sm:text-3xl text-foreground">Uma frase que nos define</h2>
          <blockquote className="text-lg sm:text-xl md:text-2xl italic text-muted-foreground p-4 sm:p-6 border-l-4 border-primary bg-card/50 rounded-md shadow-sm">
            <p>"{definingPhrase}"</p>
          </blockquote>
        </section>
      )}
      
      {!playlistUrl && (!definingPhrase || definingPhrase.trim() === "") && !anniversaryDate && localCarouselImages.length === 0 && (
        <div className="text-center text-muted-foreground mt-6 sm:mt-8 px-2">
          <p className="text-base sm:text-lg">Seu espaço está um pouco vazio...</p>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base">
             Acesse o <Link href="/dashboard" className="text-primary hover:underline">dashboard</Link> para adicionar suas memórias!
          </p>
        </div>
      )}

      <footer className="py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground/80">
        <p>Amor em Detalhes &copy; {new Date().getFullYear()}</p>
        <Link href="/dashboard" className="mt-2 inline-block text-primary hover:underline text-xs">
          <Edit className="inline-block mr-1 h-3 w-3" /> Acessar Dashboard
        </Link>
      </footer>
    </div>
  );
}
