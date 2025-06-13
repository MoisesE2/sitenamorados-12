"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  const [durationText, setDurationText] = useState("Carregando tempo juntos...");
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
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

      if (months < 0) {
        months += 12;
        years--;
      }

      const parts = [];
      if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
      if (months > 0) parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
      if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);

      if (parts.length === 0) {
        setDurationText("Eu te amo há alguns segundos!");
      } else {
        setDurationText(`Eu te amo há ${parts.join(', ')}.`);
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

  const validImages = useMemo(() => {
    if (!mounted) return [];
    return images.filter(img => img && img.imageUrl);
  }, [images, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (currentIndex >= validImages.length) setCurrentIndex(0);
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
        />
        <p className="mt-3 text-sm text-center text-muted-foreground">Configure as imagens locais em /public/assets.</p>
      </div>
    );
  }

  const currentImage = validImages[currentIndex];

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm flex flex-col items-center group">
      <Card className="w-full bg-card text-card-foreground border-border p-3 md:p-4 rounded-lg shadow-xl">
        <div className="aspect-[3/4] w-full relative overflow-hidden rounded-md bg-muted">
          <Image
            key={currentImage.id}
            src={currentImage.imageUrl}
            alt={currentImage.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 33vw"
            priority={currentIndex === 0}
          />
        </div>
      </Card>
      {validImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex((i) => (i === 0 ? validImages.length - 1 : i - 1))}
            className="absolute left-[-20px] sm:left-[-35px] md:left-[-50px] top-1/2 -translate-y-1/2 transform bg-card/40 hover:bg-card/70 text-card-foreground rounded-full"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex((i) => (i === validImages.length - 1 ? 0 : i + 1))}
            className="absolute right-[-20px] sm:right-[-35px] md:right-[-50px] top-1/2 -translate-y-1/2 transform bg-card/40 hover:bg-card/70 text-card-foreground rounded-full"
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
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("theme", "light");

  useEffect(() => {
    if (!mounted) return;

    const fetchPreferences = async () => {
      setIsLoadingPagePrefs(true);
      try {
        const res = await fetch("/api/preferences", { cache: "no-store" });
        const data: ServerPreferences = await res.json();
        setPreferences(data);

        const serverTheme = data.theme || "light";
        setTheme(serverTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(serverTheme);
      } catch {
        setPreferences(defaultPreferences);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
      } finally {
        setIsLoadingPagePrefs(false);
      }
    };

    fetchPreferences();
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  if (!mounted || isLoadingPagePrefs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        Carregando página...
      </div>
    );
  }

  const prefs = preferences || defaultPreferences;
  const [name1, name2] = prefs.coupleNames || ["Você", "Seu Amor"];
  const nameDisplay = prefs.nameDisplayPreference || "both";
  const definingPhrase = prefs.definingPhrase;
  const anniversaryDate = prefs.anniversaryDate;
  const playlistUrl = prefs.playlistUrl;

  const coupleHeader =
    nameDisplay === "user1" ? (
      <>{name1} <Heart className="inline h-6 w-6 text-primary fill-current ml-1" /></>
    ) : nameDisplay === "user2" ? (
      <>{name2} <Heart className="inline h-6 w-6 text-primary fill-current ml-1" /></>
    ) : (
      <>{name1} <span className="text-primary mx-2">&amp;</span> {name2}</>
    );

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 space-y-12 bg-background text-foreground font-body">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher theme={theme} onChange={setTheme} />
      </div>

      <header className="text-center mt-16">
        <h1 className="font-headline text-5xl tracking-tight">{coupleHeader}</h1>
      </header>

      <section className="w-full flex justify-center">
        <PhotoCarouselView images={localCarouselImages} />
      </section>

      <section className="w-full max-w-2xl px-2">
        <AnniversaryTextView anniversaryDate={anniversaryDate} />
      </section>

      {playlistUrl && (
        <section className="w-full max-w-xl text-center space-y-4">
          <h2 className="font-headline text-3xl">Nossa Trilha Sonora</h2>
          <PlaylistEmbedder isPublicView initialPlaylistUrl={playlistUrl} />
        </section>
      )}

      {definingPhrase && (
        <section className="w-full max-w-xl text-center space-y-4">
          <h2 className="font-headline text-3xl">Uma frase que nos define</h2>
          <blockquote className="italic text-muted-foreground border-l-4 border-primary p-4 bg-card/40 rounded-md">
            “{definingPhrase}”
          </blockquote>
        </section>
      )}

<footer className="text-center text-muted-foreground text-sm py-6">
  <p>Amor em Detalhes &copy; {new Date().getFullYear()}</p>
</footer>
    </div>
  );
}
