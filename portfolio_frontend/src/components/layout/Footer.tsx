import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const generateStars = (count: number) => {
  let boxShadow = '';
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    boxShadow += `${x}vw ${y}vh #fff`;
    if (i < count - 1) boxShadow += ', ';
  }
  return boxShadow;
};

export default function Footer() {
  const [stars, setStars] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = 'krisshdiwedy38@gmail.com';
    if (email) navigator.clipboard.writeText(email);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };
  
  // Safe detection for Vite SPA
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const fullText = `© ${new Date().getFullYear()} K.DIWEDY. ALL RIGHTS RESERVED.`;

  useEffect(() => {
    if (!prefersReducedMotion) {
      setStars(generateStars(30));
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowTerminal(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowTerminal(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (showTerminal && !prefersReducedMotion) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showTerminal, fullText, prefersReducedMotion]);

  return (
    <footer ref={footerRef} className="relative z-10 w-full overflow-hidden border-t-[3px] border-[var(--color-brand-border-muted)] min-h-[250px] flex flex-col justify-between mt-16 pt-16 bg-black/30 backdrop-blur-sm">
      
      {/* Background isolated elements (twinkling + satellite) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <style>
          {`
            @keyframes twinkle-footer {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.8; }
            }
            @keyframes drift-satellite {
              0% { transform: translateX(-10vw) translateY(0); }
              50% { transform: translateX(50vw) translateY(-20px); }
              100% { transform: translateX(110vw) translateY(0); }
            }
            .footer-stars {
              width: 2px;
              height: 2px;
              background: transparent;
              animation: twinkle-footer 3s infinite ease-in-out;
            }
            .satellite-drift {
              position: absolute;
              top: 30%;
              animation: drift-satellite 25s infinite linear;
              opacity: 0.4;
            }
            @media (prefers-reduced-motion: reduce) {
              .footer-stars { animation: none; opacity: 0.5; }
              .satellite-drift { animation: none; transform: translateX(50vw); }
            }
          `}
        </style>
        {stars && <div className="footer-stars" style={{ boxShadow: stars }}></div>}
        
        {/* Inline SVG Satellite */}
        <div className="satellite-drift">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="var(--color-brand-primary)" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="10" width="4" height="12"/>
            <rect x="10" y="14" width="12" height="4"/>
            <rect x="4" y="12" width="4" height="8"/>
            <rect x="24" y="12" width="4" height="8"/>
            <rect x="8" y="14" width="2" height="4"/>
            <rect x="22" y="14" width="2" height="4"/>
            <rect x="12" y="8" width="8" height="2"/>
            <rect x="12" y="22" width="8" height="2"/>
            <rect x="6" y="14" width="2" height="4" fill="var(--color-brand-secondary)"/>
            <rect x="24" y="14" width="2" height="4" fill="var(--color-brand-secondary)"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
        
        {/* Left Side: Logo */}
        <div className="flex flex-col items-start gap-4 w-full md:w-auto">
          <h2 className="font-pixel text-2xl md:text-3xl text-[var(--color-brand-text)] m-0 tracking-tight">K.DIWEDY</h2>
          <p className="opacity-60 text-sm max-w-xs text-left" style={{ fontFamily: 'var(--font-pixel-body)' }}>
            Building retro-futuristic digital experiences across the solar system.
          </p>
        </div>

        {/* Center: Nav Links */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-12 md:flex md:flex-wrap md:justify-center md:gap-8 w-full md:w-auto" style={{ fontFamily: 'var(--font-pixel-body)', fontSize: '1.2rem' }}>
          <Link to="/" className="text-[var(--color-brand-primary)] glitch-hover uppercase">Home</Link>
          <Link to="/about" className="text-[var(--color-brand-secondary)] glitch-hover uppercase">About</Link>
          <Link to="/projects" className="text-[var(--color-brand-primary)] glitch-hover uppercase">Projects</Link>
          <Link to="/experience" className="text-[var(--color-brand-secondary)] glitch-hover uppercase">Experience</Link>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex gap-6 items-center w-full md:w-auto justify-start">
          <a href="https://github.com/KrisshDiwedy38" target="_blank" rel="noreferrer" className="w-8 h-8 opacity-60 hover:opacity-100 hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]">
            <img src="/Github_Logo.png" alt="GitHub" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_#fff]" />
          </a>
          <a href="https://www.linkedin.com/in/krissh-diwedy/" target="_blank" rel="noreferrer" className="w-8 h-8 opacity-60 hover:opacity-100 hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]">
            <img src="/LinkedIn_Logo.png" alt="LinkedIn" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_#fff]" />
          </a>
          <a href="https://x.com/DiwedyKrissh" target="_blank" rel="noreferrer" className="w-8 h-8 opacity-60 hover:opacity-100 hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]">
            <img src="/X_Logo.png" alt="X / Twitter" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_#fff]" />
          </a>
          <button onClick={handleEmailClick} className="w-8 h-8 opacity-60 hover:opacity-100 hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] cursor-pointer">
            <img src="/Gmail_Logo.png" alt="Email" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_#fff]" />
          </button>
        </div>
      </div>

      {/* Bottom Copyright Terminal Sequence */}
      <div className="relative z-10 w-full text-center py-6 mt-12 border-t border-[rgba(255,255,255,0.1)]">
        <p className="text-[var(--color-brand-text)] opacity-60 text-sm tracking-widest min-h-[20px]" style={{ fontFamily: 'var(--font-pixel-body)' }}>
          {prefersReducedMotion ? fullText : typedText}
          {!prefersReducedMotion && showTerminal && <span className="animate-pulse ml-1 text-[var(--color-brand-primary)]">_</span>}
        </p>
      </div>
      
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-[var(--color-brand-primary)] text-black px-6 py-3 border-[3px] border-black shadow-[6px_6px_0px_0px_var(--color-brand-secondary)] font-pixel text-xs animate-float">
          GMAIL ID COPIED!
        </div>
      )}
    </footer>
  );
}
