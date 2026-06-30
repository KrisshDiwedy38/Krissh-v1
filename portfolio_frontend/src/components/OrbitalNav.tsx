import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrbitalPosition, getOrbitPathParams, type OrbitParams } from '../utils/orbitalPhysics';
import { useTransitionContext } from '../context/TransitionContext';

interface PlanetConfig {
  id: string;
  icon: string;
  label: string;
  path: string;
  size: number;
  orbitParams: OrbitParams;
}

const PLANETS: PlanetConfig[] = [
  {
    id: 'mars',
    icon: '/Mars-removebg-preview.png',
    label: 'SKILLS',
    path: '/skills',
    size: 60,
    orbitParams: { a: 225, e: 0.15, period: 12, initialM: 0 }
  },
  {
    id: 'earth',
    icon: '/Earth-removebg-preview.png',
    label: 'CONTACT ME',
    path: '/contact',
    size: 82,
    orbitParams: { a: 330, e: 0.2, period: 14, initialM: Math.PI / 2 }
  },
  {
    id: 'jupiter',
    icon: '/Jupiter-removebg-preview.png',
    label: 'EXPERIENCE',
    path: '/experience',
    size: 120,
    orbitParams: { a: 480, e: 0.25, period: 22, initialM: Math.PI }
  },
  {
    id: 'saturn',
    icon: '/Saturn-removebg-preview.png',
    label: 'PROJECTS',
    path: '/projects',
    size: 135,
    orbitParams: { a: 550, e: 0.30, period: 25, initialM: Math.PI * 1.5 }
  }
];

export default function OrbitalNav() {
  const {
    triggerTransition,
    transitionState,
    transitionPlanet,
    transitionType,
    registerDestination,
    setArrivingState
  } = useTransitionContext();
  const requestRef = useRef<number>(0);
  const location = useLocation();

  // Refs to the actual DOM elements for high-performance direct mutation
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updatePositions = (time: number) => {
    PLANETS.forEach(planet => {
      const pos = getOrbitalPosition(time, planet.orbitParams);
      const el = planetRefs.current[planet.id];
      if (el) {
        // We translate the element perfectly on the 2D plane first, THEN stand it up so it faces the camera
        el.style.transform = `translate(${pos.x}px, ${pos.y}px) rotateX(-75deg)`;
      }
    });
    requestRef.current = requestAnimationFrame(updatePositions);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Measure and register target coordinates if arriving back to Home page
  useEffect(() => {
    if (transitionState === 'departing' && transitionType === 'page-to-home' && transitionPlanet) {
      const measureAndRegister = () => {
        const planetId = transitionPlanet;
        const btnDesktop = document.getElementById(`${planetId}-btn-desktop`);
        const btnMobile = document.getElementById(`${planetId}-btn-mobile`);
        const activeBtn = btnDesktop && btnDesktop.getBoundingClientRect().width > 0 ? btnDesktop : btnMobile;

        if (activeBtn) {
          const rect = activeBtn.getBoundingClientRect();
          let size = 80;
          if (planetId === 'sun') {
            size = activeBtn === btnDesktop ? 240 : 120;
          } else {
            const planetConfig = PLANETS.find(p => p.id === planetId);
            size = planetConfig ? (activeBtn === btnDesktop ? planetConfig.size : 80) : 80;
          }

          registerDestination({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            size: size
          });
          setArrivingState(planetId);
        }
      };

      // Delay measurement slightly to ensure first updatePositions frame is rendered
      const timer = setTimeout(measureAndRegister, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionState, transitionType, transitionPlanet]);

  const handlePlanetClick = (e: React.MouseEvent<HTMLButtonElement>, planetId: string, path: string, size: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startCoords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: size
    };
    triggerTransition(planetId, startCoords, path);
  };

  // Check transition states for visibility toggling
  const isSunTransitioning = (transitionState === 'departing' || transitionState === 'arriving') && transitionPlanet === 'sun';

  return (
    <>
      {/* --- DESKTOP ORBITAL VIEW --- */}
      <div
        className="hidden md:flex relative w-full items-center justify-center transition-all duration-1000 ease-in-out opacity-100 blur-0"
        style={{ perspective: '1000px', height: 'min(850px, max(460px, 80vw))' }}
      >
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500" style={{ transform: 'scale(min(1, calc(100vw / 1100)))' }}>
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(75deg)' }}>

            <svg className="absolute overflow-visible w-0 h-0 pointer-events-none" style={{ zIndex: 0 }}>
              {PLANETS.map(planet => {
                const { a, b, c } = getOrbitPathParams(planet.orbitParams);
                return (
                  <ellipse
                    key={`${planet.id}-path`}
                    cx={-c}
                    cy={0}
                    rx={a}
                    ry={b}
                    fill="none"
                    stroke="var(--color-brand-border-muted)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                );
              })}
            </svg>

            <div
              id="sun-wrapper"
              className="absolute z-10 flex flex-col items-center justify-center transition-transform"
              style={{ width: 0, height: 0, transform: 'rotateX(-75deg)' }}
            >
              <button
                id="sun-btn-desktop"
                onClick={(e) => handlePlanetClick(e, 'sun', '/about', 240)}
                className="group absolute flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                style={{
                  width: '240px',
                  height: '240px',
                  left: '-120px',
                  top: '-120px',
                  opacity: isSunTransitioning ? 0 : 1,
                  visibility: isSunTransitioning ? 'hidden' : 'visible'
                }}
                aria-label="About Me"
              >
                <img src="/Sun-removebg-preview.png" alt="The Sun" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(254,0,254,0.6)]" />
                <span className={`absolute -bottom-8 font-pixel ${location.pathname === '/about' ? 'text-[13px] text-white opacity-100' : 'text-[10px] text-[var(--color-brand-primary)] opacity-80 group-hover:opacity-100'} whitespace-nowrap transition-opacity`}>
                  ABOUT ME
                </span>
              </button>
            </div>

            {PLANETS.map(planet => {
              const isPlanetTransitioning = (transitionState === 'departing' || transitionState === 'arriving') && transitionPlanet === planet.id;
              return (
                <div
                  key={planet.id}
                  ref={el => { planetRefs.current[planet.id] = el; }}
                  className="absolute z-20 flex flex-col items-center justify-center"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 0,
                    height: 0,
                    transform: 'translate(0px, 0px) rotateX(-75deg)',
                  }}
                >
                  <button
                    id={`${planet.id}-btn-desktop`}
                    onClick={(e) => handlePlanetClick(e, planet.id, planet.path, planet.size)}
                    className="group absolute flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
                    style={{
                      width: `${planet.size}px`,
                      height: `${planet.size}px`,
                      left: `-${planet.size / 2}px`,
                      top: `-${planet.size / 2}px`,
                      opacity: isPlanetTransitioning ? 0 : 1,
                      visibility: isPlanetTransitioning ? 'hidden' : 'visible'
                    }}
                    aria-label={planet.label}
                  >
                    <img src={planet.icon} alt={planet.label} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,251,251,0.5)]" />
                    <span className={`absolute -bottom-8 font-pixel ${location.pathname === planet.path ? 'text-[10.4px] opacity-100 font-bold text-white' : 'text-[8px] opacity-60 group-hover:opacity-100'} text-[var(--color-brand-text)] whitespace-nowrap transition-opacity bg-[var(--color-brand-bg)] px-2 py-1 rounded border border-[var(--color-brand-primary)]`}>
                      {planet.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MOBILE VERTICAL LIST FALLBACK --- */}
      <div className="flex md:hidden flex-col items-center justify-center gap-12 py-12 relative w-full mt-10">
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 border-l-2 border-dotted border-[var(--color-brand-border-muted)] z-0" />

        {/* Sun */}
        <button
          id="sun-btn-mobile"
          onClick={(e) => handlePlanetClick(e, 'sun', '/about', 120)}
          className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer min-w-[44px] min-h-[44px]"
          style={{
            opacity: isSunTransitioning ? 0 : 1,
            visibility: isSunTransitioning ? 'hidden' : 'visible'
          }}
        >
          <img src="/Sun-removebg-preview.png" className="w-[120px] h-[120px] object-contain drop-shadow-[0_0_30px_rgba(254,0,254,0.6)] group-hover:scale-105 transition-transform motion-reduce:transition-none" />
          <span className={`font-pixel ${location.pathname === '/about' ? 'text-[15.6px] text-white border-2' : 'text-[12px] text-[var(--color-brand-primary)]'} bg-[var(--color-brand-bg)] px-2 py-1`}>ABOUT ME</span>
        </button>

        {/* Planets */}
        {PLANETS.map(planet => {
          const isPlanetTransitioning = (transitionState === 'departing' || transitionState === 'arriving') && transitionPlanet === planet.id;
          return (
            <button
              key={`mobile-${planet.id}`}
              id={`${planet.id}-btn-mobile`}
              onClick={(e) => handlePlanetClick(e, planet.id, planet.path, 80)}
              className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer min-w-[44px] min-h-[44px]"
              style={{
                opacity: isPlanetTransitioning ? 0 : 1,
                visibility: isPlanetTransitioning ? 'hidden' : 'visible'
              }}
            >
              <img src={planet.icon} className="w-[80px] h-[80px] object-contain drop-shadow-[0_0_15px_rgba(0,251,251,0.5)] group-hover:scale-105 transition-transform motion-reduce:transition-none" />
              <span className={`font-pixel ${location.pathname === planet.path ? 'text-[13px] opacity-100 text-white font-bold' : 'text-[10px]'} text-[var(--color-brand-text)] bg-[var(--color-brand-bg)] px-2 py-1 rounded border border-[var(--color-brand-primary)]`}>
                {planet.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
