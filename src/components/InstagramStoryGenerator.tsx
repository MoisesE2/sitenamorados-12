
"use client";
import type { FC } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstagramStoryGenerator: FC = () => {
  const { toast } = useToast();

  const handleGenerateStory = () => {
    console.log("Generating Instagram Story...");
    toast({
      title: "Gerador de Story (Em Breve)",
      description: "Esta funcionalidade ainda está em desenvolvimento.",
      variant: "default"
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
         <div className="flex items-center space-x-2.5 mb-1.5">
          <Share2 className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Gerador de Story</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Crie uma imagem personalizada para compartilhar no Instagram! (Funcionalidade futura)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
          Em breve, você poderá gerar uma imagem de story com os nomes do casal, data especial e uma foto.
        </p>
        <Button onClick={handleGenerateStory} variant="secondary">
          <ImageIcon className="mr-2 h-4 w-4" />
          Gerar Story (Em Breve)
        </Button>
      </CardContent>
    </Card>
  );
};

export { InstagramStoryGenerator };
