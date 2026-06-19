import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrbitalPosition, getOrbitPathParams, type OrbitParams } from '../utils/orbitalPhysics';

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
    label: 'MARS (SKILLS)',
    path: '/skills',
    size: 40,
    orbitParams: { a: 150, e: 0.15, period: 8, initialM: 0 }
  },
  {
    id: 'earth',
    icon: '/Earth-removebg-preview.png',
    label: 'EARTH (CONTACT)',
    path: '/contact',
    size: 55,
    orbitParams: { a: 220, e: 0.2, period: 14, initialM: Math.PI / 2 }
  },
  {
    id: 'jupiter',
    icon: '/Jupiter-removebg-preview.png',
    label: 'JUPITER (EXP)',
    path: '/experience',
    size: 80,
    orbitParams: { a: 320, e: 0.25, period: 22, initialM: Math.PI }
  },
  {
    id: 'saturn',
    icon: '/Saturn-removebg-preview.png',
    label: 'SATURN (PROJS)',
    path: '/projects',
    size: 90,
    orbitParams: { a: 450, e: 0.35, period: 34, initialM: Math.PI * 1.5 }
  }
];

export default function OrbitalNav() {
  const navigate = useNavigate();
  const [isZooming, setIsZooming] = useState(false);
  const requestRef = useRef<number>(0);
  
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

  const handleNavigate = (path: string) => {
    setIsZooming(true);
    setTimeout(() => {
      navigate(path);
      setIsZooming(false);
    }, 800);
  };

  return (
    <div 
      className={`relative h-[700px] w-full flex items-center justify-center transition-all duration-1000 ease-in-out ${isZooming ? 'scale-[4] opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'}`} 
      style={{ perspective: '1000px' }}
    >
      <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(75deg)' }}>
        
        {/* SVG for Orbit Paths */}
        <svg className="absolute overflow-visible w-0 h-0" style={{ zIndex: 0 }}>
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

        {/* The Sun */}
        <div 
          className="absolute z-10 flex flex-col items-center justify-center transition-transform"
          style={{ width: 0, height: 0, transform: 'rotateX(-75deg)' }}
        >
          <button 
            onClick={() => handleNavigate('/about')}
            className="group absolute flex items-center justify-center hover:scale-110 transition-transform"
            style={{ width: '120px', height: '120px', left: '-60px', top: '-60px' }}
            aria-label="About Me"
          >
            <img src="/Sun-removebg-preview.png" alt="The Sun" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(254,0,254,0.6)]" />
            <span className="absolute -bottom-8 font-pixel text-[10px] text-[var(--color-brand-primary)] whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
              THE SUN (ABOUT)
            </span>
          </button>
        </div>

        {/* Orbiting Planets */}
        {PLANETS.map(planet => {
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
                transform: 'translate(0px, 0px) rotateX(-75deg)', // Default start, immediately overridden by rAF
              }}
            >
              <button 
                onClick={() => handleNavigate(planet.path)}
                className="group absolute flex items-center justify-center hover:scale-125 transition-transform"
                style={{ 
                  width: `${planet.size}px`, 
                  height: `${planet.size}px`,
                  left: `-${planet.size / 2}px`,
                  top: `-${planet.size / 2}px`,
                }}
                aria-label={planet.label}
              >
                <img src={planet.icon} alt={planet.label} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,251,251,0.5)]" />
                <span className="absolute -bottom-8 font-pixel text-[8px] text-[var(--color-brand-text)] whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-bg)] px-2 py-1 rounded border border-[var(--color-brand-primary)]">
                  {planet.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
