
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage"; // Added import

const PublicPageHeader = () => {
  const [mounted, setMounted] = useState(false);
  // Use useLocalStorage for theme management
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("theme", "light");

  useEffect(() => {
    setMounted(true);
    // Initial theme read and system preference check is handled by useLocalStorage
    // and its initialValue or what's already in localStorage.
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply the theme class to the document element
      // Saving to localStorage is handled by the setTheme from useLocalStorage
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };
  
  if (!mounted) {
    // Avoid hydration mismatch by not rendering theme-dependent icons server-side initially
    return <div className="flex justify-between items-center w-full h-[40px] py-2">
      <div className="w-10 h-10"></div> {/* Placeholder for login button */}
      <div className="w-10 h-10"></div> {/* Placeholder for theme toggle button */}
    </div>;
  }

  return (
    <header className="flex justify-between items-center w-full py-2">
      <Link href="/login">
        <Button variant="ghost" size="icon" aria-label="Login ou Registro">
          <UserCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
        {theme === "light" ? (
          <Moon className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Sun className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </header>
  );
};

export default PublicPageHeader;
