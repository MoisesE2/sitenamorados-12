
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ListMusic, Youtube, Disc3 as SpotifyIcon, Trash2, Loader2 } from "lucide-react";

interface PlaylistFormProps {
  initialUrl: string | null;
  onSave: (url: string | null) => Promise<void>;
  isSaving: boolean;
}

export function PlaylistForm({ initialUrl, onSave, isSaving }: PlaylistFormProps) {
  const { toast } = useToast();
  const [currentLink, setCurrentLink] = useState(initialUrl || "");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setCurrentLink(initialUrl || "");
  }, [initialUrl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSave(currentLink.trim() || null); // Pass null if link is empty
      toast({
        title: "Sucesso!",
        description: currentLink.trim() ? "Link da playlist salvo." : "Link da playlist removido.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar o link da playlist.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async () => {
    try {
      await onSave(null);
      setCurrentLink("");
      toast({ title: "Playlist Removida", description: "O link da playlist foi removido."});
    } catch (error) {
       toast({
        title: "Erro ao Remover",
        description: error instanceof Error ? error.message : "Não foi possível remover o link da playlist.",
        variant: "destructive",
      });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="playlistLink">
          <div className="flex items-center space-x-1 text-foreground">
            <SpotifyIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
            /
            <Youtube className="inline-block ml-1 mr-1.5 h-4 w-4 text-muted-foreground" />
             Link da Playlist (Spotify ou YouTube)
          </div>
        </Label>
        <Input
          id="playlistLink"
          name="playlistLink"
          type="url"
          placeholder="https://open.spotify.com/... ou https://music.youtube.com/..."
          value={currentLink}
          onChange={(e) => setCurrentLink(e.target.value)}
          className="bg-input-bg"
          disabled={isSaving}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListMusic className="mr-2 h-4 w-4" />}
          {isSaving ? "Salvando..." : "Salvar Playlist"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleRemove}
          disabled={isSaving || !initialUrl}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Remover Atual
        </Button>
      </div>
    </form>
  );
}
