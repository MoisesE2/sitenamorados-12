
"use client";
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Save, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// useLocalStorage and UserData import removed
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type NameDisplayPreference = 'both' | 'user1' | 'user2';

interface NameDisplayPreferenceEditorProps {
  currentCoupleNames: [string, string];
  currentPreference: NameDisplayPreference;
  onSave: (newNames: [string, string], newPreference: NameDisplayPreference) => Promise<void>;
  isSaving: boolean;
}

const NameDisplayPreferenceEditor: FC<NameDisplayPreferenceEditorProps> = ({
  currentCoupleNames,
  currentPreference,
  onSave,
  isSaving
}) => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [localPreference, setLocalPreference] = useState<NameDisplayPreference>('both');
  const { toast } = useToast(); // Keep toast for local validation

  useEffect(() => {
    setName1(currentCoupleNames[0] || '');
    setName2(currentCoupleNames[1] || '');
    setLocalPreference(currentPreference || 'both');
  }, [currentCoupleNames, currentPreference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name1.trim() === "" || name2.trim() === "") {
      toast({
        title: "Erro de Validação",
        description: "Os nomes do casal não podem estar vazios.",
        variant: "destructive",
      });
      return;
    }
    await onSave([name1.trim(), name2.trim()], localPreference);
    // Toast for success/failure will be handled by the parent DashboardPage
  };
  
  return (
     <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <Users className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Nomes do Casal & Exibição</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Defina os nomes que aparecerão na página pública e como serão exibidos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 border-b border-border pb-6 mb-6">
            <div>
              <Label htmlFor="displayName1" className="text-foreground mb-1.5 block">Nome 1</Label>
              <Input 
                id="displayName1" 
                value={name1} 
                onChange={(e) => setName1(e.target.value)}
                placeholder="Primeiro nome"
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="displayName2" className="text-foreground mb-1.5 block">Nome 2</Label>
              <Input 
                id="displayName2" 
                value={name2} 
                onChange={(e) => setName2(e.target.value)}
                placeholder="Segundo nome"
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <Label className="text-foreground font-medium text-base block mb-2">Exibição na página pública:</Label>
            <RadioGroup 
              value={localPreference} 
              onValueChange={(value) => setLocalPreference(value as NameDisplayPreference)} 
              className="space-y-2.5"
              disabled={isSaving}
            >
              <div className="flex items-center space-x-2.5">
                <RadioGroupItem value="both" id="pref-both" disabled={isSaving} />
                <Label htmlFor="pref-both" className={`font-normal text-foreground ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  {(name1 || "Nome 1").trim()} <span className="text-primary mx-1">&amp;</span> {(name2 || "Nome 2").trim()}
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <RadioGroupItem value="user1" id="pref-user1" disabled={isSaving} />
                <Label htmlFor="pref-user1" className={`font-normal text-foreground flex items-center ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  {(name1 || "Nome 1").trim()} <Heart className="ml-1.5 h-4 w-4 text-primary fill-primary" />
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <RadioGroupItem value="user2" id="pref-user2" disabled={isSaving} />
                <Label htmlFor="pref-user2" className={`font-normal text-foreground flex items-center ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  {(name2 || "Nome 2").trim()} <Heart className="ml-1.5 h-4 w-4 text-primary fill-primary" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Salvando..." : "Salvar Configurações de Nomes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { NameDisplayPreferenceEditor };
