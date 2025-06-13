
import type { FC } from 'react';

interface DefiningPhraseSectionProps {
  phrase: string;
  author: string;
}

const DefiningPhraseSection: FC<DefiningPhraseSectionProps> = ({ phrase, author }) => {
  return (
    <section className="py-6 text-center">
      <h2 className="text-2xl font-headline text-primary-foreground mb-4">Uma frase que nos define</h2>
      <blockquote className="bg-muted p-6 rounded-lg shadow-md max-w-sm mx-auto">
        <p className="text-lg italic text-primary-foreground">
          &ldquo;{phrase}&rdquo;
        </p>
        <cite className="block text-right text-sm text-accent mt-4 not-italic">
          - {author}
        </cite>
      </blockquote>
    </section>
  );
};

export default DefiningPhraseSection;

