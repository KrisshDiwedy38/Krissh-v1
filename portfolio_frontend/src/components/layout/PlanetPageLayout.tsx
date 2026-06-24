import React from 'react';
import PageTransition from './PageTransition';

interface PlanetPageLayoutProps {
  title?: string;
  planetColor?: string;
  planetIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PlanetPageLayout({ children }: PlanetPageLayoutProps) {
  return (
    <PageTransition className="w-full">
      {/* Main content area containing moons */}
      <div className="max-w-[1440px] w-full mx-auto px-4 py-6 md:px-12 md:py-12 pt-2 md:pt-4">
        {children}
      </div>
    </PageTransition>
  );
}
