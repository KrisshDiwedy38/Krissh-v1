import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import api from '../api';

interface AboutData {
  bio: string;
  profile_image: string;
  resume_url: string;
  title: string;
  core_skill: string;
  weapon: string;
  base: string;
}

export default function About() {
  const navigate = useNavigate();
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    api.get('/about/')
      .then(res => setAbout(res.data))
      .catch(err => console.error('Failed to fetch about', err));
  }, []);

  const bio = about?.bio || '';

  return (
    <PageTransition>
      <main className="flex-grow pt-8 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="font-pixel text-3xl md:text-4xl text-white uppercase mb-4 pixel-glitch">About Me</h1>
          <div className="h-1 w-32 bg-[var(--color-brand-secondary)] mx-auto" />
        </header>

        {/* Two Column Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Image */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="neobrutal-card w-full aspect-square md:aspect-auto md:h-full relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-surface-1)] to-[var(--color-brand-surface-3)] flex items-center justify-center">
                <span className="font-pixel text-8xl text-[var(--color-brand-primary)] opacity-30">KD</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-1 font-pixel text-sm uppercase">K. Diwedy</div>
            </div>
          </div>

          {/* Right: Content Block */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="neobrutal-card h-full flex flex-col justify-center p-4 md:p-8">
              <div className="mb-6">
                <h2 className="font-pixel text-2xl text-[var(--color-brand-secondary)] mb-4">{about?.title || 'The Architect'}</h2>
                <p className="font-sans text-lg text-[var(--color-brand-text)] leading-relaxed">
                  {bio}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 border-b-2 border-[var(--color-brand-border-muted)] pb-2">
                  <span className="text-[var(--color-brand-primary)]">⭐</span>
                  <p className="font-sans font-bold text-sm text-[var(--color-brand-text)] opacity-70 uppercase">Core: {about?.core_skill || 'Celestial Neobrutalism'}</p>
                </div>
                <div className="flex items-center space-x-4 border-b-2 border-[var(--color-brand-border-muted)] pb-2">
                  <span className="text-[var(--color-brand-secondary)]">💻</span>
                  <p className="font-sans font-bold text-sm text-[var(--color-brand-text)] opacity-70 uppercase">Weapon: {about?.weapon || 'Modern Frontend & Shaders'}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[var(--color-brand-tertiary)]">🌐</span>
                  <p className="font-sans font-bold text-sm text-[var(--color-brand-text)] opacity-70 uppercase">Base: {about?.base || 'Digital Nebula 0x4'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Action Row */}
          <div className="md:col-span-12 mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
            <a href={about?.resume_url || '#'} className="neobrutal-btn-primary w-full md:w-auto text-center">RESUME</a>
            <button onClick={() => navigate('/contact')} className="neobrutal-btn-secondary w-full md:w-auto text-center">CONTACT ME</button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
