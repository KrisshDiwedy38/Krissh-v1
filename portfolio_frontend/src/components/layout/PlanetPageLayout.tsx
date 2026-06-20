import React from 'react';
import PageTransition from './PageTransition';
import TopNavStrip from './TopNavStrip';

interface PlanetPageLayoutProps {
  title?: string;
  planetColor?: string;
  planetIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PlanetPageLayout({ children }: PlanetPageLayoutProps) {
  return (
    <PageTransition className="w-full">
      <TopNavStrip />
      
      {/* Main content area containing moons */}
      <div className="max-w-[1440px] w-full mx-auto p-6 md:p-12 pt-2 md:pt-4">
        {children}
      </div>
    </PageTransition>
  );
}
