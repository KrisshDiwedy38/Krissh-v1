import { useState, useEffect, useRef } from 'react';
import PageTransition from '../components/layout/PageTransition';
import { getOrbitalPosition, getOrbitPathParams, type OrbitParams } from '../utils/orbitalPhysics';

interface SatelliteConfig {
  id: string;
  icon: string;
  label: string;
  href: string;
  orbitParams: OrbitParams;
  color: string;
  size: number;
}

const SATELLITES: SatelliteConfig[] = [
  {
    id: 'gmail',
    icon: '/Gmail_Logo.png',
    label: 'GMAIL',
    href: 'mailto:contact@krissh.dev',
    orbitParams: { a: 160, e: 0.2, period: 10, initialM: 0 },
    color: 'var(--color-brand-primary)',
    size: 70,
  },
  {
    id: 'linkedin',
    icon: '/LinkedIn_Logo.png',
    label: 'LINKEDIN',
    href: 'https://linkedin.com',
    orbitParams: { a: 220, e: 0.25, period: 16, initialM: Math.PI / 2 },
    color: 'var(--color-brand-secondary)',
    size: 85,
  },
  {
    id: 'github',
    icon: '/Github_Logo.png',
    label: 'GITHUB',
    href: 'https://github.com',
    orbitParams: { a: 280, e: 0.3, period: 24, initialM: Math.PI },
    color: 'var(--color-brand-tertiary)',
    size: 95,
  },
  {
    id: 'twitter',
    icon: '/X_Logo.png',
    label: 'X / TWITTER',
    href: 'https://x.com',
    orbitParams: { a: 360, e: 0.35, period: 34, initialM: Math.PI * 1.5 },
    color: 'var(--color-brand-primary-tint)',
    size: 80,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const requestRef = useRef<number>(0);
  const satelliteRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updatePositions = (time: number) => {
    SATELLITES.forEach(sat => {
      const pos = getOrbitalPosition(time, sat.orbitParams);
      const el = satelliteRefs.current[sat.id];
      if (el) {
        el.style.transform = `translate(${pos.x}px, ${pos.y}px) rotateX(-70deg)`;
      }
    });
    requestRef.current = requestAnimationFrame(updatePositions);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('TRANSMISSION COMPLETE');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('SIGNAL LOST — TRY AGAIN');
      }
    } catch {
      setStatus('SIGNAL LOST — TRY AGAIN');
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen pt-32 pb-8 px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Title */}
        <div className="text-center mb-4 z-10">
          <h1 className="font-pixel text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-4">ESTABLISH CONTACT</h1>
          <p className="font-sans text-lg text-[var(--color-brand-text)] opacity-70 max-w-2xl">Transmitting through the celestial void. Select a frequency to connect with the mothership.</p>
        </div>

        {/* Central Earth + Satellite Links (Physics Based) */}
        <div className="relative w-full max-w-4xl h-[500px] md:h-[700px] flex items-center justify-center scale-[0.85] md:scale-125 lg:scale-150">
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'translateX(126px) rotateX(70deg)' }}>
            
            {/* SVG for Orbit Paths */}
            <svg className="absolute overflow-visible w-0 h-0" style={{ zIndex: 0 }}>
              {SATELLITES.map(sat => {
                const { a, b, c } = getOrbitPathParams(sat.orbitParams);
                return (
                  <ellipse 
                    key={`${sat.id}-path`}
                    cx={-c} 
                    cy={0} 
                    rx={a} 
                    ry={b} 
                    fill="none" 
                    stroke="var(--color-brand-border-muted)" 
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                );
              })}
            </svg>

            {/* Central Earth Node */}
            <div className="absolute z-10 flex flex-col items-center justify-center" style={{ width: 0, height: 0, transform: 'rotateX(-70deg)' }}>
              <div className="relative flex items-center justify-center" style={{ width: '160px', height: '160px', transform: 'translate(-50%, -50%)' }}>
                <img src="/Earth-removebg-preview.png" alt="Planet Earth" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,221,221,0.5)]" />
                <div className="absolute -bottom-10 bg-white text-black font-pixel text-xs px-4 py-2 whitespace-nowrap shadow-[4px_4px_0px_0px_#ffabf3]">
                  PLANET EARTH
                </div>
              </div>
            </div>

            {/* Satellite Links */}
            {SATELLITES.map(sat => {
              return (
                <div 
                  key={sat.id}
                  ref={el => { satelliteRefs.current[sat.id] = el; }}
                  className="absolute z-20 flex flex-col items-center justify-center"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 0,
                    height: 0,
                    transform: 'translate(0px, 0px) rotateX(-70deg)',
                  }}
                >
                  <a 
                    href={sat.href}
                    className="group absolute flex flex-col items-center hover:scale-110 transition-transform"
                    style={{ 
                      width: '100px',
                      height: '100px',
                      left: '-50px',
                      top: '-50px'
                    }}
                  >
                    <div className="flex items-center justify-center w-full h-full bg-[var(--color-brand-surface-2)] border-[4px] border-white transition-all rounded-full" style={{ boxShadow: `6px 6px 0px 0px ${sat.color}` }}>
                      {sat.icon.endsWith('.png') || sat.icon.endsWith('.svg') ? (
                        <img src={sat.icon} alt={sat.label} className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
                      ) : (
                        <span className="text-4xl">{sat.icon}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-10 font-pixel text-[10px] text-[var(--color-brand-text)] whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-bg)] px-3 py-2 rounded border" style={{ borderColor: sat.color }}>
                      {sat.label}
                    </span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <section className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
          {/* Coordinates */}
          <div className="bg-[var(--color-brand-surface-2)] p-8 border-[3px] border-white shadow-[8px_8px_0px_0px_var(--color-brand-secondary)]">
            <h3 className="font-pixel text-base mb-2 flex items-center gap-2 text-white">COORDINATES</h3>
            <p className="font-sans text-sm text-[var(--color-brand-text)] opacity-70 mb-6">
              Currently drifting through the digital sector. Open for remote missions and collaborative deep-space exploration.
            </p>
            <div className="flex flex-wrap gap-2">
              {['REACT', 'NODE.JS', 'PYTHON', 'DJANGO'].map(t => (
                <span key={t} className="px-2 py-1 bg-[var(--color-brand-surface-3)] border-2 border-white font-sans text-xs">{t}</span>
              ))}
            </div>
          </div>
          {/* Signal Status */}
          <div className="bg-[var(--color-brand-surface-2)] p-8 border-[3px] border-white shadow-[8px_8px_0px_0px_var(--color-brand-primary)]">
            <h3 className="font-pixel text-base mb-2 flex items-center gap-2 text-white">SIGNAL STATUS</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-sans text-xs mb-1 uppercase text-[var(--color-brand-text)] opacity-60">
                  <span>Signal Strength</span>
                  <span>92%</span>
                </div>
                <div className="h-4 bg-[var(--color-brand-surface-3)] border-2 border-white flex gap-1 p-0.5">
                  <div className="h-full bg-[var(--color-brand-primary)] w-1/5" />
                  <div className="h-full bg-[var(--color-brand-primary)] w-1/5" />
                  <div className="h-full bg-[var(--color-brand-primary)] w-1/5" />
                  <div className="h-full bg-[var(--color-brand-primary)] w-1/5" />
                  <div className="h-full bg-[var(--color-brand-surface-3)] w-1/5 opacity-20" />
                </div>
              </div>
              <div className="text-[var(--color-brand-primary-tint)] font-sans text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-brand-primary)] animate-pulse rounded-full" />
                READY FOR TRANSMISSION
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mt-16 w-full max-w-4xl relative z-30">
          <div className="bg-[var(--color-brand-surface-2)] p-8 border-[3px] border-white shadow-[8px_8px_0px_0px_var(--color-brand-secondary)]">
            <h3 className="font-pixel text-xl text-white mb-6">TRANSMIT MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="CALLSIGN (Name)"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none"
              />
              <input
                type="email" placeholder="FREQUENCY (Email)"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none"
              />
              <textarea
                placeholder="MESSAGE PAYLOAD" rows={5}
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none resize-none"
              />
              <button type="submit" className="neobrutal-btn-primary w-full">TRANSMIT</button>
              {status && <p className="font-pixel text-sm text-center text-[var(--color-brand-primary)] mt-4">{status}</p>}
            </form>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
