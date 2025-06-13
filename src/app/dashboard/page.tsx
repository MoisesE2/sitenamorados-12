
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AnniversaryEditor } from "@/components/dashboard/AnniversaryEditor";
import { PlaylistEmbedder } from "@/components/PlaylistEmbedder";
import { PhotoUploader } from "@/components/PhotoUploader";
import { DefiningPhraseEditor } from "@/components/dashboard/DefiningPhraseEditor";
import { InstagramStoryGenerator } from "@/components/InstagramStoryGenerator";
import { NameDisplayPreferenceEditor, type NameDisplayPreference } from "@/components/dashboard/NameDisplayPreferenceEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/useMounted";

export interface ServerPreferences {
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

export default function DashboardPage(): JSX.Element {
  const [preferences, setPreferences] = useState<ServerPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const mounted = useMounted();
  const { toast } = useToast();

  useEffect(() => {
    if (mounted) {
      const fetchPreferences = async () => {
        setIsLoadingPreferences(true);
        try {
          const response = await fetch('/api/preferences');
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Erro desconhecido ao buscar preferências."}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          const data: ServerPreferences = await response.json();
          setPreferences(data);
          // Apply server theme to document
          if (data.theme) {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(data.theme);
          }
        } catch (error) {
          console.error("Failed to load preferences for dashboard:", error);
          toast({
            title: "Erro ao Carregar Preferências",
            description: `Não foi possível buscar as configurações do servidor. Usando padrões. Detalhe: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          });
          setPreferences(defaultPreferences);
          // Apply default theme to document on error
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(defaultPreferences.theme);
        } finally {
          setIsLoadingPreferences(false);
        }
      };
      fetchPreferences();
    }
  }, [mounted, toast]);

  // Apply theme to document whenever preferences.theme changes
  useEffect(() => {
    if (preferences?.theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(preferences.theme);
    }
  }, [preferences?.theme]);

  const handleSavePreferences = useCallback(async (updatedPrefsPayload: Partial<ServerPreferences>) => {
    if (!preferences && !isLoadingPreferences) {
      toast({
        title: "Erro ao Salvar",
        description: "Preferências não carregadas. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);

    const basePrefs = preferences || defaultPreferences;
    // Ensure coupleNames is always a two-element array even if basePrefs.coupleNames is null
    const currentCoupleNames = basePrefs.coupleNames || defaultPreferences.coupleNames || ["Você", "Seu Amor"];
    
    const newPreferencesToSave: ServerPreferences = {
      anniversaryDate: updatedPrefsPayload.anniversaryDate !== undefined ? updatedPrefsPayload.anniversaryDate : basePrefs.anniversaryDate,
      playlistUrl: updatedPrefsPayload.playlistUrl !== undefined ? updatedPrefsPayload.playlistUrl : basePrefs.playlistUrl,
      definingPhrase: updatedPrefsPayload.definingPhrase !== undefined ? updatedPrefsPayload.definingPhrase : basePrefs.definingPhrase,
      coupleNames: updatedPrefsPayload.coupleNames !== undefined ? updatedPrefsPayload.coupleNames : currentCoupleNames,
      nameDisplayPreference: updatedPrefsPayload.nameDisplayPreference !== undefined ? updatedPrefsPayload.nameDisplayPreference : basePrefs.nameDisplayPreference,
      theme: updatedPrefsPayload.theme !== undefined ? updatedPrefsPayload.theme : basePrefs.theme,
    };


    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferencesToSave),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
      
      setPreferences(responseData.preferences || newPreferencesToSave); 
      toast({
        title: "Preferências Salvas!",
        description: "Suas alterações foram salvas no servidor.",
        variant: "default" 
      });

    } catch (error) {
      console.error("Failed to save preferences:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      setPreferences(newPreferencesToSave); 
      toast({
        title: "Erro ao Salvar no Servidor",
        description: `Não foi possível salvar suas alterações no servidor: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [preferences, toast, isLoadingPreferences]);

  const handleDashboardThemeToggle = async () => {
    if (!preferences) return;
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    // Optimistically update UI and local state, then save.
    setPreferences(prev => prev ? {...prev, theme: newTheme} : defaultPreferences);
    // The useEffect for preferences.theme will handle document.documentElement
    await handleSavePreferences({ theme: newTheme }); // Save to server
  };


  if (!mounted || isLoadingPreferences || !preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mr-3" />
        Carregando suas preferências...
      </div>
    );
  }

  const currentPrefsToEdit = preferences || defaultPreferences;

  return (
    <AppLayout
      customHeaderButton={
        <Link href="/" legacyBehavior={false}>
          <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">
            <Eye className="mr-1.5 h-4 w-4" />
            Ver Página
          </Button>
        </Link>
      }
      currentTheme={currentPrefsToEdit.theme}
      onToggleTheme={handleDashboardThemeToggle}
    >
      <div className="space-y-6 md:space-y-8">
        <NameDisplayPreferenceEditor
          currentCoupleNames={currentPrefsToEdit.coupleNames || ["Você", "Seu Amor"]}
          currentPreference={currentPrefsToEdit.nameDisplayPreference}
          onSave={async (newNames, newPreference) => {
            await handleSavePreferences({ coupleNames: newNames, nameDisplayPreference: newPreference });
          }}
          isSaving={isSaving}
        />
        <AnniversaryEditor
          currentDate={currentPrefsToEdit.anniversaryDate}
          onSave={async (newDate) => {
            await handleSavePreferences({ anniversaryDate: newDate });
          }}
          isSaving={isSaving}
        />
        <PlaylistEmbedder
          initialPlaylistUrl={currentPrefsToEdit.playlistUrl}
          onSavePlaylistUrl={async (newUrl) => {
            await handleSavePreferences({ playlistUrl: newUrl });
          }}
          isSaving={isSaving}
          isPublicView={false}
        />
        <PhotoUploader />
        <DefiningPhraseEditor
          currentPhrase={currentPrefsToEdit.definingPhrase}
          onSave={async (newPhrase) => {
            await handleSavePreferences({ definingPhrase: newPhrase });
          }}
          isSaving={isSaving}
        />
        <InstagramStoryGenerator />
      </div>
    </AppLayout>
  );
}
