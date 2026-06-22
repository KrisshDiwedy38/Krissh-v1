import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTransitionContext } from '../../context/TransitionContext';

interface StripPlanet {
  id: string;
  label: string;
  path: string;
  icon: string;
  size: number; // base size on desktop
  mobileSize: number; // size on mobile
}

const NAV_ORDER: StripPlanet[] = [
  { id: 'sun', label: 'ABOUT ME', path: '/about', icon: '/Sun-removebg-preview.png', size: 120, mobileSize: 90 },
  { id: 'mars', label: 'SKILLS', path: '/skills', icon: '/Mars-removebg-preview.png', size: 70, mobileSize: 55 },
  { id: 'earth', label: 'CONTACT', path: '/contact', icon: '/Earth-removebg-preview.png', size: 90, mobileSize: 65 },
  { id: 'jupiter', label: 'EXPERIENCE', path: '/experience', icon: '/Jupiter-removebg-preview.png', size: 110, mobileSize: 80 },
  { id: 'saturn', label: 'PROJECTS', path: '/projects', icon: '/Saturn-removebg-preview.png', size: 120, mobileSize: 85 }
];

export default function TopNavStrip() {
  const {
    transitionState,
    triggerTransition,
    registerDestination,
    setArrivingState,
    transitionType,
    transitionDirection
  } = useTransitionContext();

  const placeholderRef = useRef<HTMLDivElement | null>(null);

  // Find index of current page path
  const currentPath = window.location.pathname;
  const currentIdx = NAV_ORDER.findIndex(p => p.path === currentPath);

  // Fallback to sun/about if path is unrecognized (e.g. login or admin)
  const activeIdx = currentIdx !== -1 ? currentIdx : 0;
  const currentPlanet = NAV_ORDER[activeIdx];

  const prevPlanet = NAV_ORDER[(activeIdx - 1 + NAV_ORDER.length) % NAV_ORDER.length];
  const nextPlanet = NAV_ORDER[(activeIdx + 1) % NAV_ORDER.length];

  // Measure and register coordinates
  useEffect(() => {
    const measureAndRegister = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        // Register center coordinates and size (full size of the planet)
        registerDestination({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          size: rect.width
        });

        // If we just loaded the page as part of a routing transition, set arriving state
        if (transitionState === 'departing') {
          setArrivingState(currentPlanet.id);
        }
      }
    };

    // Delay measurement slightly to ensure layout rendering is complete
    const timer = setTimeout(measureAndRegister, 50);
    window.addEventListener('resize', measureAndRegister);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureAndRegister);
    };
  }, [currentPlanet.id, transitionState]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        document.getElementById('nav-prev-planet')?.click();
      } else if (e.key === 'ArrowRight') {
        document.getElementById('nav-next-planet')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPlanet, nextPlanet]);

  const handlePlanetClick = (e: React.MouseEvent<HTMLButtonElement>, planet: StripPlanet, direction: 'left' | 'right') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const finalSize = isMobile ? planet.mobileSize : planet.size;

    triggerTransition(
      planet.id,
      {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: finalSize
      },
      planet.path,
      direction
    );
  };

  // Determine if center planet should be hidden (handled by TransitionOverlay during Home <-> Page)
  const showCenterPlanet = transitionType === 'page-to-page' || transitionState === 'idle';

  // Entry animation configurations for flanking planets during page-to-page transition
  const leftIsEntering = transitionState === 'arriving' && transitionType === 'page-to-page' && transitionDirection === 'left';
  const leftInitial = leftIsEntering
    ? { opacity: 0, x: -150, scale: 0.8 }
    : { opacity: 0.65, x: 0, scale: 1 };

  const rightIsEntering = transitionState === 'arriving' && transitionType === 'page-to-page' && transitionDirection === 'right';
  const rightInitial = rightIsEntering
    ? { opacity: 0, x: 150, scale: 0.8 }
    : { opacity: 0.65, x: 0, scale: 1 };

  const flankingTransition = {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as any
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex justify-center mt-0 mb-4 sm:mb-8 z-40 select-none">
      {/* 3-Planet Navigation Strip */}
      <div className="flex items-start gap-6 sm:gap-12 md:gap-20">
        
        {/* Left Flanking Planet */}
        <motion.button
          id="nav-prev-planet"
          onClick={(e) => handlePlanetClick(e as any, prevPlanet, 'left')}
          initial={leftInitial}
          animate={{ opacity: 0.65, x: 0, scale: 1 }}
          exit={transitionDirection === 'right' ? { opacity: 0, x: -150, scale: 0.8 } : undefined}
          whileHover={{ opacity: 1, scale: 1.15, y: -4 }}
          transition={flankingTransition}
          className="group relative flex flex-col items-center cursor-pointer bg-transparent border-0 outline-none mt-6 md:mt-11"
          aria-label={`Go to ${prevPlanet.label}`}
        >
          <motion.div
            layoutId={`planet-image-${prevPlanet.id}`}
            className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          >
            <img src={prevPlanet.icon} alt="" className="w-full h-full object-contain" />
          </motion.div>
          <span className="absolute -bottom-6 font-pixel text-[6px] md:text-[8px] text-[var(--color-brand-text)] opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-bg)] px-1 py-0.5 rounded border border-[var(--color-brand-border-muted)] whitespace-nowrap">
            {prevPlanet.label}
          </span>
        </motion.button>

        {/* Center Focal Planet (Clipped Horizon) */}
        <div className="relative flex flex-col items-center select-none z-10">
          {/* Clipped Containing Box */}
          <div className="w-[180px] h-[108px] md:w-[280px] md:h-[168px] relative">
            {/* Full Planet Wrapper (with ref for destination coords calculation) */}
            <div 
              ref={placeholderRef}
              className="absolute w-[180px] h-[180px] md:w-[280px] md:h-[280px] top-[-72px] md:top-[-112px] left-0 [clip-path:inset(40%_-20%_-20%_-20%)]"
            >
              {showCenterPlanet && (
                <motion.div
                  layoutId={`planet-image-${currentPlanet.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <img 
                    src={currentPlanet.icon} 
                    alt={currentPlanet.label} 
                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  />
                </motion.div>
              )}
            </div>
          </div>
          {/* Active Label (outside overflow-hidden so it is not clipped) */}
          {showCenterPlanet && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute bottom-[-24px] font-pixel text-[8px] md:text-[10px] text-[var(--color-brand-primary)] whitespace-nowrap bg-black/60 px-3 py-1.5 rounded border border-[var(--color-brand-primary)] tracking-wide z-20"
            >
              {currentPlanet.label}
            </motion.span>
          )}
        </div>

        {/* Right Flanking Planet */}
        <motion.button
          id="nav-next-planet"
          onClick={(e) => handlePlanetClick(e as any, nextPlanet, 'right')}
          initial={rightInitial}
          animate={{ opacity: 0.65, x: 0, scale: 1 }}
          exit={transitionDirection === 'left' ? { opacity: 0, x: 150, scale: 0.8 } : undefined}
          whileHover={{ opacity: 1, scale: 1.15, y: -4 }}
          transition={flankingTransition}
          className="group relative flex flex-col items-center cursor-pointer bg-transparent border-0 outline-none mt-6 md:mt-11"
          aria-label={`Go to ${nextPlanet.label}`}
        >
          <motion.div
            layoutId={`planet-image-${nextPlanet.id}`}
            className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          >
            <img src={nextPlanet.icon} alt="" className="w-full h-full object-contain" />
          </motion.div>
          <span className="absolute -bottom-6 font-pixel text-[6px] md:text-[8px] text-[var(--color-brand-text)] opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-bg)] px-1 py-0.5 rounded border border-[var(--color-brand-border-muted)] whitespace-nowrap">
            {nextPlanet.label}
          </span>
        </motion.button>

      </div>
    </div>
  );
}
