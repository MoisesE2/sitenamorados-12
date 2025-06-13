
import type { FC } from 'react';

interface CoupleNamesSectionProps {
  names: [string, string];
}

const CoupleNamesSection: FC<CoupleNamesSectionProps> = ({ names }) => {
  return (
    <section className="text-center py-4">
      <h1 className="text-4xl md:text-5xl font-headline text-primary-foreground">
        {names[0]} <span className="text-accent">&amp;</span> {names[1]}
      </h1>
    </section>
  );
};

export default CoupleNamesSection;
