
"use client";
import type { FC, ReactNode } from 'react';
import React from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
// useLocalStorage and useMounted removed as theme is now managed by parent

interface AppLayoutProps {
  children: ReactNode;
  customHeaderButton?: ReactNode;
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AppLayout: FC<AppLayoutProps> = ({
  children,
  customHeaderButton,
  currentTheme,
  onToggleTheme
}) => {

  // Effect to apply theme to documentElement, driven by prop
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(currentTheme);
    }
  }, [currentTheme]);

  // Basic check for mounted state to prevent hydration issues if absolutely necessary,
  // but primarily, the theme logic is now simpler and driven by props.
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
     // Simple non-styled loader to prevent flash or theme mismatch during initial render
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        Carregando Layout...
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col font-body transition-colors duration-300`}>
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <AppLogo />
          <div className="flex items-center space-x-2 sm:space-x-3">
            {customHeaderButton}
            <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Alternar tema" className="text-foreground hover:text-primary shrink-0">
              {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="py-4 md:py-6 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        Amor em Detalhes &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export { AppLayout };
