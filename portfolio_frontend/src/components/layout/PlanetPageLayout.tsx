import React from 'react';
import PageTransition from './PageTransition';

interface PlanetPageLayoutProps {
  title: string;
  planetColor: string; // Tailwind color variable or hex
  planetIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PlanetPageLayout({ title, planetColor, planetIcon, children }: PlanetPageLayoutProps) {
  return (
    <PageTransition className="w-full">
      {/* Top arc blob */}
      <div className="relative w-full overflow-hidden h-48 md:h-64 bg-[var(--color-brand-bg)]">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[120%] aspect-square rounded-[50%] border-b-[8px] border-[var(--color-brand-border)]"
          style={{ backgroundColor: planetColor }}
        >
          {/* Pixel-art texture overlay placeholder */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '12px 12px' }}>
          </div>
        </div>
        
        {/* Title positioned at the bottom edge of the arc */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-2">
            {planetIcon && <div className="text-4xl">{planetIcon}</div>}
            <h1 className="font-pixel text-3xl md:text-5xl uppercase text-white shadow-black drop-shadow-lg tracking-wider">
                {title}
            </h1>
        </div>
      </div>

      {/* Main content area containing moons */}
      <div className="max-w-[1440px] w-full mx-auto p-6 md:p-12">
        {children}
      </div>
    </PageTransition>
  );
}
