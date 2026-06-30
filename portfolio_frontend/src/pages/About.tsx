import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { useApiData } from '../hooks/useApiData';
import type { AboutMe } from '../types';

export default function About() {
  const navigate = useNavigate();
  const { data: about, loading, error } = useApiData<AboutMe>('/about/');

  if (loading) return <div className="text-white text-center p-8 font-pixel h-full flex items-center justify-center">LOADING ABOUT ME...</div>;
  if (error) return <div className="text-[#ffabf3] text-center p-8 font-pixel h-full flex items-center justify-center">ERROR: {error}</div>;

  const bio = about?.bio || '';

  return (
    <PageTransition>
      <main className="flex-grow pt-8 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">

        {/* Two Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Image */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="neobrutal-card w-full aspect-square relative overflow-hidden">
              {about?.profile_image ? (
                <img src={about.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-surface-1)] to-[var(--color-brand-surface-3)] flex items-center justify-center">
                  <span className="font-pixel text-8xl text-[var(--color-brand-primary)] opacity-30">KD</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-1 font-pixel text-sm uppercase">K. Diwedy</div>
            </div>
          </div>

          {/* Right: Content Block */}
          <div className="lg:col-span-7 flex flex-col justify-between">
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
          <div className="lg:col-span-12 mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
            <a href={about?.resume || '#'} className="neobrutal-btn-primary w-full md:w-auto text-center">RESUME</a>
            <button onClick={() => navigate('/contact')} className="neobrutal-btn-secondary w-full md:w-auto text-center">CONTACT ME</button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
