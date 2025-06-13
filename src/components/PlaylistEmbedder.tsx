
"use client";
import type { FC } from 'react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaylistForm } from "@/components/forms/playlist-form";
import { Music2, Loader2 } from "lucide-react"; // Added Loader2
import { useMounted } from '@/hooks/useMounted';

interface PlaylistEmbedderProps {
  isPublicView?: boolean;
  initialPlaylistUrl: string | null; // For dashboard and public view initial load
  onSavePlaylistUrl?: (newUrl: string | null) => Promise<void>; // For dashboard save
  isSaving?: boolean; // For dashboard save
}

const PlaylistEmbedder: FC<PlaylistEmbedderProps> = ({
  isPublicView = false,
  initialPlaylistUrl,
  onSavePlaylistUrl,
  isSaving = false,
}) => {
  const mounted = useMounted();

  if (isPublicView) {
    if (!mounted) {
      return (
        <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-center">Carregando player...</p>
        </div>
      );
    }

    if (initialPlaylistUrl) {
      let embedContent = null;
      try {
        const url = new URL(initialPlaylistUrl);

        if (url.hostname === 'open.spotify.com' && url.pathname.includes('/playlist/')) {
          const playlistId = url.pathname.split('/playlist/')[1]?.split('?')[0];
          if (playlistId) {
            const embedSpotifyUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
            embedContent = (
              <iframe
                style={{ borderRadius: '12px' }}
                src={embedSpotifyUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Playlist Embed"
              ></iframe>
            );
          } else {
             embedContent = <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-lg"><p className="text-center">Link do Spotify inválido.</p></div>;
          }
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'music.youtube.com' || url.hostname === 'youtu.be') {
          let videoId = null;
          let listId = null;

          if (url.hostname === 'youtu.be') {
            videoId = url.pathname.substring(1);
             // Check if it's a playlist URL from youtu.be like youtu.be/VIDEO_ID?list=PLAYLIST_ID
            const searchParams = new URLSearchParams(url.search);
            listId = searchParams.get('list');

          } else {
            videoId = url.searchParams.get('v');
            listId = url.searchParams.get('list');
          }
          
          if (listId) { // YouTube Playlist
            const embedYouTubeUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`;
            embedContent = (
              <iframe
                width="100%"
                className="aspect-video"
                src={embedYouTubeUrl}
                title="YouTube Playlist Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            );
          } else if (videoId) { // Single YouTube Video
            const embedYouTubeUrl = `https://www.youtube.com/embed/${videoId}`;
            embedContent = (
              <iframe
                width="100%"
                className="aspect-video"
                src={embedYouTubeUrl}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            );
          } else {
            embedContent = <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-lg"><p className="text-center">Link do YouTube inválido ou não é um vídeo/playlist.</p></div>;
          }
        } else {
          embedContent = <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-lg"><p className="text-center">Link da playlist não suportado. Use Spotify ou YouTube.</p></div>;
        }
      } catch (error) {
        console.error("Invalid playlist URL:", initialPlaylistUrl, error);
        embedContent = <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground p-4 rounded-lg"><p className="text-center">Ocorreu um erro ao carregar a playlist. Verifique o link.</p></div>;
      }
      return embedContent;
    }
    // If no initialPlaylistUrl for public view, render nothing or a placeholder
    return null;
  }

  // Dashboard view:
  if (typeof onSavePlaylistUrl !== 'function') {
    // This should not happen if used correctly in dashboard, but good for safety
    return <p>Error: onSavePlaylistUrl not provided for PlaylistEmbedder in dashboard mode.</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <Music2 className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Nossa Trilha Sonora</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Adicione ou atualize o link da playlist do casal (Spotify ou YouTube Music). Esta playlist será exibida na página pública.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlaylistForm 
          initialUrl={initialPlaylistUrl}
          onSave={onSavePlaylistUrl} 
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export { PlaylistEmbedder };
