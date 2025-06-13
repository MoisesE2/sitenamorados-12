
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase"; // Updated import
import useLocalStorage from "@/hooks/useLocalStorage";
import type { UserData } from "@/app/dashboard/page"; // Assuming UserData is exported from dashboard
import { LogIn } from "lucide-react";
import AppLogo from "@/components/app-logo";

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const [, setUserData] = useLocalStorage<UserData | null>("amorDigitalUser", null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        const newUserData: UserData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          // coupleNames will be set in the dashboard
        };
        setUserData(newUserData);
        router.push("/dashboard");
      } else {
        throw new Error("Não foi possível obter informações do usuário do Google.");
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Falha ao fazer login com o Google. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pt-6 pb-4">
          <CardTitle className="text-3xl sm:text-4xl font-headline text-primary">Bem-vindo!</CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
            Acesse com sua conta Google para criar e compartilhar sua página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full bg-primary hover:bg-primary-btn-hover text-primary-foreground" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Entrando..."
            ) : (
              <>
                <GoogleIcon />
                Entrar com Google
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
          <div className="text-center mt-4">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">Voltar para Página Pública</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
