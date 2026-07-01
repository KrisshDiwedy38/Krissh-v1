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
    href: '#',
    orbitParams: { a: 160, e: 0.2, period: 10, initialM: 0 },
    color: 'var(--color-brand-primary)',
    size: 60,
  },
  {
    id: 'linkedin',
    icon: '/LinkedIn_Logo.png',
    label: 'LINKEDIN',
    href: 'https://linkedin.com/in/krisshdiwedy38',
    orbitParams: { a: 220, e: 0.25, period: 16, initialM: Math.PI / 2 },
    color: 'var(--color-brand-secondary)',
    size: 60,
  },
  {
    id: 'github',
    icon: '/Github_Logo.png',
    label: 'GITHUB',
    href: 'https://github.com/KrisshDiwedy38',
    orbitParams: { a: 280, e: 0.3, period: 24, initialM: Math.PI },
    color: 'var(--color-brand-tertiary)',
    size: 60,
  },
  {
    id: 'twitter',
    icon: '/X_Logo.png',
    label: 'X / TWITTER',
    href: 'https://x.com/KDiwedy',
    orbitParams: { a: 300, e: 0.3, period: 34, initialM: Math.PI * 1.5 },
    color: 'var(--color-brand-primary-tint)',
    size: 60,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSatelliteClick = (e: React.MouseEvent, satId: string) => {
    if (satId === 'gmail') {
      e.preventDefault();
      const email = 'krisshdiwedy38@gmail.com';
      if (email) navigator.clipboard.writeText(email);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

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
    setStatus('TRANSMITTING...');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('TRANSMISSION COMPLETE');
        setFormData({ name: '', email: '', message: '' });
      } else {
        // error silenced
        setStatus('SIGNAL LOST — TRY AGAIN');
      }
    } catch (error) {
      // error silenced
      setStatus('SIGNAL LOST — TRY AGAIN');
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen pt-8 pb-8 px-8 flex flex-col items-center justify-center relative overflow-hidden">

        {/* --- DESKTOP ORBITAL VIEW --- */}
        <div
          className="hidden md:flex relative w-full max-w-4xl h-[600px] items-center justify-center scale-[0.9] lg:scale-[1.1] xl:scale-[1.25] transition-all duration-300"
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)' }}>

            {/* SVG for Orbit Paths */}
            <svg
              className="absolute overflow-visible pointer-events-none"
              style={{
                zIndex: 0,
                left: '50%',
                top: '50%',
                width: 0,
                height: 0
              }}
            >
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
            <div
              className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                width: '160px',
                height: '160px',
                marginLeft: '-80px',
                marginTop: '-80px',
                transform: 'rotateX(-70deg)'
              }}
            >
              <img src="/Earth-removebg-preview.png" alt="Planet Earth" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,221,221,0.5)]" />
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
                    onClick={(e) => handleSatelliteClick(e, sat.id)}
                    className="group absolute flex flex-col items-center transition-transform duration-300"
                    style={{
                      width: `${sat.size}px`,
                      height: `${sat.size}px`,
                      left: `-${sat.size / 2}px`,
                      top: `-${sat.size / 2}px`
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-full h-full rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: '#ffffff',
                        boxShadow: `0 0 25px 6px ${sat.color}`,
                        border: `3px solid ${sat.color}`,
                      }}
                    >
                      {sat.icon.endsWith('.png') || sat.icon.endsWith('.svg') ? (
                        <img src={sat.icon} alt={sat.label} className="w-[60%] h-[60%] object-contain rounded-full" />
                      ) : (
                        <span className="text-2xl md:text-3xl">{sat.icon}</span>
                      )}
                    </span>
                    <span className="absolute -bottom-8 font-pixel text-[9px] text-[var(--color-brand-text)] whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-bg)] px-2 py-1 rounded border" style={{ borderColor: sat.color }}>
                      {sat.label}
                    </span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MOBILE VERTICAL LIST FALLBACK --- */}
        <div className="flex md:hidden flex-col items-center justify-center gap-10 py-12 relative w-full mt-4">
          <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 border-l-2 border-dotted border-[var(--color-brand-border-muted)] z-0" />

          {/* Central Earth */}
          <div className="relative z-10 flex flex-col items-center gap-2 group min-w-[44px] min-h-[44px]">
            <img src="/Earth-removebg-preview.png" className="w-[120px] h-[120px] object-contain drop-shadow-[0_0_30px_rgba(0,221,221,0.5)] group-hover:scale-105 transition-transform motion-reduce:transition-none" />
          </div>

          {/* Social Links */}
          {SATELLITES.map(sat => (
            <a
              key={`mobile-${sat.id}`}
              href={sat.href}
              onClick={(e) => handleSatelliteClick(e, sat.id)}
              className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer min-w-[44px] min-h-[44px]"
            >
              <span
                className="flex items-center justify-center w-[60px] h-[60px] rounded-full transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                style={{
                  background: '#ffffff',
                  boxShadow: `0 0 15px 4px ${sat.color}`,
                  border: `3px solid ${sat.color}`,
                }}
              >
                {sat.icon.endsWith('.png') || sat.icon.endsWith('.svg') ? (
                  <img src={sat.icon} alt={sat.label} className="w-[60%] h-[60%] object-contain rounded-full" />
                ) : (
                  <span className="text-xl">{sat.icon}</span>
                )}
              </span>
              <span className="font-pixel text-[10px] text-[var(--color-brand-text)] bg-[var(--color-brand-bg)] px-2 py-1 rounded border" style={{ borderColor: sat.color }}>
                {sat.label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <section className="mt-16 w-full max-w-4xl relative z-30">
          <div className="bg-[var(--color-brand-surface-2)] p-5 md:p-8 border-[3px] border-white shadow-[8px_8px_0px_0px_var(--color-brand-secondary)]">
            <h3 className="font-pixel text-xl text-white mb-6">TRANSMIT MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="CALLSIGN (Name)"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none"
              />
              <input
                type="email" placeholder="FREQUENCY (Email)"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none"
              />
              <textarea
                placeholder="MESSAGE PAYLOAD" rows={5}
                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[var(--color-brand-surface-1)] border-[3px] border-white text-white font-sans px-4 py-3 placeholder:text-[var(--color-brand-text)] placeholder:opacity-30 focus:border-[var(--color-brand-primary)] outline-none resize-none"
              />
              <button type="submit" className="neobrutal-btn-primary w-full">TRANSMIT</button>
              {status && <p className="font-pixel text-sm text-center text-[var(--color-brand-primary)] mt-4">{status}</p>}
            </form>
          </div>
        </section>

        {/* Toast Notification */}
        {toastVisible && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-[var(--color-brand-primary)] text-black px-6 py-3 border-[3px] border-black shadow-[6px_6px_0px_0px_var(--color-brand-secondary)] font-pixel text-xs animate-float">
            GMAIL ID COPIED!
          </div>
        )}
      </main>
    </PageTransition>
  );
}
