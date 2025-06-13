
"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Loader2 } from "lucide-react"; // Added Loader2
import useLocalStorage from "@/hooks/useLocalStorage";
import { useMounted } from '@/hooks/useMounted';

interface ThemeSwitcherProps {
  serverTheme?: 'light' | 'dark' | null; // Theme fetched from server
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ serverTheme }) => {
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage<'light' | 'dark'>("theme", "light");
  const [effectiveTheme, setEffectiveTheme] = React.useState<'light' | 'dark'>(serverTheme || localStorageTheme || 'light');
  const mounted = useMounted();

  // Effect to sync server theme to local storage and apply it
  useEffect(() => {
    if (mounted) {
      let initialTheme = 'light'; // Default theme
      if (serverTheme) {
        initialTheme = serverTheme;
        if (serverTheme !== localStorageTheme) {
          setLocalStorageTheme(serverTheme); // Sync server to local
        }
      } else {
        initialTheme = localStorageTheme; // Fallback to localStorage if no server theme
      }
      setEffectiveTheme(initialTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
    }
  }, [serverTheme, localStorageTheme, setLocalStorageTheme, mounted]);


  // Effect to apply theme when effectiveTheme changes (e.g., user toggle)
   useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
      // Also update localStorage if the toggle caused a change different from current localStorage
      if (effectiveTheme !== localStorageTheme) {
          setLocalStorageTheme(effectiveTheme);
      }
    }
  }, [effectiveTheme, mounted, localStorageTheme, setLocalStorageTheme]);


  const toggleTheme = () => {
    setEffectiveTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="bg-card/50 hover:bg-card/70 border-border/30 text-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    ); 
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Alternar tema"
      className="bg-card/50 hover:bg-card/70 border-border/30 text-foreground"
    >
      {effectiveTheme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};
