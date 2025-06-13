import { Heart } from 'lucide-react';
import Link from 'next/link';

const AppLogo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1 -ml-1">
      <Heart className="w-8 h-8 sm:w-9 sm:h-9 fill-primary text-primary-foreground stroke-primary-foreground" />
      <h1 className="text-2xl sm:text-3xl font-headline whitespace-nowrap">Amor em Detalhes</h1>
    </Link>
  );
};

export default AppLogo;
