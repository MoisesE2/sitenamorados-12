
import Image from 'next/image';
import type { FC } from 'react';

interface FavoriteMusicSectionProps {
  title: string;
  artist: string;
  albumArtUrl: string;
  playerHint?: string;
}

const FavoriteMusicSection: FC<FavoriteMusicSectionProps> = ({ title, artist, albumArtUrl, playerHint }) => {
  return (
    <section className="py-6 text-center">
      <h2 className="text-2xl font-headline text-primary-foreground mb-4">Nossa música favorita</h2>
      <div className="bg-muted p-4 rounded-lg shadow-md max-w-sm mx-auto">
        {/* Placeholder for embedded player - using an image for now */}
        <div className="relative w-full aspect-[350/80] rounded overflow-hidden">
          <Image
            src={albumArtUrl}
            alt={`Capa do álbum para ${title}`}
            layout="fill"
            objectFit="contain"
            data-ai-hint={playerHint || "music album"}
          />
        </div>
        {/* <p className="text-lg font-semibold mt-2 text-primary-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{artist}</p> */}
      </div>
    </section>
  );
};

export default FavoriteMusicSection;

