
"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselImage {
  src: string;
  alt: string;
  hint?: string;
}

interface ImageCarouselSectionProps {
  images: CarouselImage[];
}

const ImageCarouselSection: React.FC<ImageCarouselSectionProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <section className="py-6 text-center">
        <p className="text-muted-foreground">Nenhuma imagem para exibir.</p>
      </section>
    );
  }

  return (
    <section className="py-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <div className="relative w-full aspect-[4/5] max-w-xs sm:max-w-sm md:max-w-md rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint={image.hint || "photo"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 bg-card text-card-foreground hover:bg-card/80" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 bg-card text-card-foreground hover:bg-card/80" />
        </div>
         <div className="md:hidden flex justify-center mt-4 space-x-4">
            <CarouselPrevious className="bg-card text-card-foreground hover:bg-card/80 static transform-none" />
            <CarouselNext className="bg-card text-card-foreground hover:bg-card/80 static transform-none" />
        </div>
      </Carousel>
    </section>
  );
};

export default ImageCarouselSection;
