
"use client";
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Kept for author, though not saved
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, Save, Loader2 } from 'lucide-react';
// useToast removed as parent will handle it
// useLocalStorage removed

interface DefiningPhraseEditorProps {
  currentPhrase: string | null;
  onSave: (newPhrase: string | null) => Promise<void>;
  isSaving: boolean;
}

const DefiningPhraseEditor: FC<DefiningPhraseEditorProps> = ({ currentPhrase, onSave, isSaving }) => {
  const [phrase, setPhrase] = useState('');
  const [author, setAuthor] = useState(''); // Author remains local, not saved to server preferences

  useEffect(() => {
    setPhrase(currentPhrase || "");
  }, [currentPhrase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(phrase.trim() || null);
    // Toast for success/failure will be handled by the parent DashboardPage
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <Quote className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Frase que nos Define</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Adicione ou edite a frase especial que representa o casal. O autor é opcional e não será exibido na página pública.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="definingPhrase" className="text-foreground mb-1.5 block">Frase</Label>
            <Textarea 
              id="definingPhrase" 
              value={phrase} 
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Ex: 'O amor não se vê com os olhos, mas com o coração.'"
              rows={3}
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="definingPhraseAuthor" className="text-foreground mb-1.5 block">Autor/Fonte (Opcional, não salvo)</Label>
            <Input 
              id="definingPhraseAuthor" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: William Shakespeare"
              disabled={isSaving} // Disable if form is saving, though not part of saved data
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Salvando..." : "Salvar Frase"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { DefiningPhraseEditor };
