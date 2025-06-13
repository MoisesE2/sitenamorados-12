
"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleAddPhoto, type HandleAddPhotoState } from "@/app/actions"; // Import the state type
import { ImagePlus, FileImage } from "lucide-react";

interface PhotoUploadFormProps {
  onPhotoAdded: (imageUrl: string, alias?: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? "Carregando Foto..." : <> <ImagePlus className="mr-2 h-4 w-4" /> Carregar Foto </>}
    </Button>
  );
}

export function PhotoUploadForm({ onPhotoAdded }: PhotoUploadFormProps) {
  const { toast } = useToast();
  // Provide the explicit type for the state and initial state
  const [state, formAction, isPending] = useActionState<HandleAddPhotoState, FormData>(handleAddPhoto, null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastProcessedStateRef = useRef<HandleAddPhotoState | null>(null); // Ref to track the last processed state object

  useEffect(() => {
    if (isPending) {
      // Optionally, clear lastProcessedStateRef if you want to allow re-processing if the same state object is somehow re-issued by React.
      // However, for now, we only care about processing a *new* state object upon action completion.
      return;
    }

    // Only process if state is new and different from the last processed one
    if (state && state !== lastProcessedStateRef.current) {
      if (state.success && state.addedImageUrl) { // state.success is true, so it's AddPhotoSuccessState
        toast({
          title: "Sucesso!",
          description: state.message,
        });
        onPhotoAdded(state.addedImageUrl, state.addedImageAlias);
        formRef.current?.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
      } else if (!state.success && state.message) { // state.success is false, so it's AddPhotoErrorState
        toast({
          title: "Erro",
          description: state.message || "Falha ao carregar a foto.",
          variant: "destructive",
        });
      } else if (!state.success && state.errors) {
         let errorMessages = "Erro de validação: ";
        Object.values(state.errors).forEach(errArray => {
          if (Array.isArray(errArray)) {
            errorMessages += errArray.join(", ");
          }
        });
        toast({
          title: "Erro de Validação",
          description: errorMessages,
          variant: "destructive",
        });
      }
      lastProcessedStateRef.current = state; // Mark this state object as processed
    }
  }, [state, isPending, toast, onPhotoAdded]); // Removed formRef and fileInputRef as they are stable

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="imageFile">
          <FileImage className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
          Arquivo da Foto
        </Label>
        <Input
          id="imageFile"
          name="imageFile"
          type="file"
          accept="image/*"
          required
          className="bg-input-bg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          ref={fileInputRef}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="imageAlias">
          <ImagePlus className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
          Apelido/Nome para a Foto (Opcional)
        </Label>
        <Input
          id="imageAlias"
          name="imageAlias"
          type="text"
          placeholder="Ex: Nossa viagem à praia"
          className="bg-input-bg"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
