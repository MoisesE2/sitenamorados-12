import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaylistForm } from "@/components/forms/playlist-form";
import { Music2 } from "lucide-react";

const PlaylistSection = () => {
  return (
    <Card className="shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Music2 className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl text-primary">Nossa Trilha Sonora</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground">
          Adicione o link da playlist do casal no Spotify ou YouTube Music.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlaylistForm />
      </CardContent>
    </Card>
  );
};

export default PlaylistSection;
