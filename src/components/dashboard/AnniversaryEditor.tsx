
"use client";
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AnniversaryEditorProps {
  currentDate: string | null;
  onSave: (newDate: string | null) => Promise<void>;
  isSaving: boolean;
}

const AnniversaryEditor: FC<AnniversaryEditorProps> = ({ currentDate, onSave, isSaving }) => {
  const [inputDate, setInputDate] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (currentDate) {
      try {
        // Assuming currentDate is a valid ISO string or can be parsed by Date
        const dateObj = new Date(currentDate);
        // Format to YYYY-MM-DD for the date input
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        setInputDate(`${year}-${month}-${day}`);
      } catch (e) {
        console.error("Error parsing current anniversary date:", e);
        setInputDate(""); 
      }
    } else {
      setInputDate("");
    }
  }, [currentDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let dateToSaveISO: string | null = null;
    if (inputDate) {
      try {
        // Convert YYYY-MM-DD from input to a full ISO string at the start of the day in UTC
        const [year, month, day] = inputDate.split('-').map(Number);
        const dateToSave = new Date(Date.UTC(year, month - 1, day));
        if (isNaN(dateToSave.getTime())) {
          toast({
            title: "Data Inválida",
            description: "Por favor, insira uma data válida.",
            variant: "destructive",
          });
          return;
        }
        dateToSaveISO = dateToSave.toISOString();
      } catch (e) {
        toast({
            title: "Erro de Formato de Data",
            description: "Por favor, insira a data no formato correto.",
            variant: "destructive",
          });
        return;
      }
    }
    
    await onSave(dateToSaveISO);
    // Toast for success/failure will be handled by the parent DashboardPage
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2.5 mb-1.5">
            <CalendarDays className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl text-primary">Nosso Aniversário</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">Defina a data especial do casal. Ela será usada para contagens e lembretes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="anniversaryDateInput" className="text-foreground mb-1.5 block">Data do Aniversário</Label>
            <Input 
              id="anniversaryDateInput"
              type="date" 
              value={inputDate}
              onChange={handleDateChange}
              disabled={isSaving}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Salvando..." : "Salvar Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { AnniversaryEditor };
