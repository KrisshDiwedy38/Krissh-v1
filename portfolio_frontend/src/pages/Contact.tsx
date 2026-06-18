import { useState } from 'react';
import PageTransition from '../components/layout/PageTransition';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

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
      <main className="min-h-screen pt-32 pb-8 px-8 flex flex-col items-center justify-center relative">
        {/* Title */}
        <div className="text-center mb-16 z-10">
          <h1 className="font-pixel text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-4">ESTABLISH CONTACT</h1>
          <p className="font-sans text-lg text-[var(--color-brand-text)] opacity-70 max-w-2xl">Transmitting through the celestial void. Select a frequency to connect with the mothership.</p>
        </div>

        {/* Central Earth + Satellite Links */}
        <div className="relative w-full max-w-4xl aspect-square md:aspect-video flex items-center justify-center">
          {/* Orbit Rings (decorative) */}
          <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
            <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-4 border-dashed border-[var(--color-brand-border-muted)] rounded-full" style={{ animation: 'spin 20s linear infinite' }} />
            <div className="absolute w-[450px] h-[450px] md:w-[700px] md:h-[700px] border-2 border-dotted border-[var(--color-brand-border-muted)] rounded-full" style={{ animation: 'spin 20s linear infinite reverse' }} />
          </div>

          {/* Central Earth Node */}
          <div className="relative z-20" style={{ filter: 'drop-shadow(0 0 20px rgba(0,221,221,0.3))' }}>
            <div className="w-48 h-48 md:w-64 md:h-64 bg-[var(--color-brand-surface-3)] border-4 border-white flex items-center justify-center">
              <span className="font-pixel text-4xl text-[var(--color-brand-primary)]">🌍</span>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-black font-pixel text-sm px-4 py-2 whitespace-nowrap shadow-[4px_4px_0px_0px_#ffabf3]">
              PLANET EARTH
            </div>
          </div>

          {/* Satellite Links */}
          <div className="absolute top-0 left-0 md:top-1/4 md:left-10 z-30">
            <a href="mailto:contact@krissh.dev" className="flex flex-col items-center">
              <div className="p-6 bg-[var(--color-brand-surface-2)] border-[3px] border-white shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-primary)] transition-all">
                <span className="text-4xl">📧</span>
              </div>
              <span className="font-pixel text-sm mt-4 text-white">GMAIL</span>
            </a>
          </div>

          <div className="absolute top-0 right-0 md:top-1/4 md:right-10 z-30">
            <a href="https://linkedin.com" className="flex flex-col items-center">
              <div className="p-6 bg-[var(--color-brand-surface-2)] border-[3px] border-white shadow-[6px_6px_0px_0px_var(--color-brand-secondary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-secondary)] transition-all">
                <span className="text-4xl">🔗</span>
              </div>
              <span className="font-pixel text-sm mt-4 text-[var(--color-brand-secondary)]">LINKEDIN</span>
            </a>
          </div>

          <div className="absolute bottom-0 left-0 md:bottom-1/4 md:left-10 z-30">
            <a href="https://github.com" className="flex flex-col items-center">
              <div className="p-6 bg-[var(--color-brand-surface-2)] border-[3px] border-white shadow-[6px_6px_0px_0px_var(--color-brand-tertiary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-tertiary)] transition-all">
                <span className="text-4xl">💻</span>
              </div>
              <span className="font-pixel text-sm mt-4 text-white">GITHUB</span>
            </a>
          </div>

          <div className="absolute bottom-0 right-0 md:bottom-1/4 md:right-10 z-30">
            <a href="https://x.com" className="flex flex-col items-center">
              <div className="p-6 bg-[var(--color-brand-surface-2)] border-[3px] border-white shadow-[6px_6px_0px_0px_var(--color-brand-primary-tint)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-primary-tint)] transition-all">
                <span className="text-4xl">𝕏</span>
              </div>
              <span className="font-pixel text-sm mt-4 text-[var(--color-brand-primary-tint)]">X / TWITTER</span>
            </a>
          </div>
        </div>

        {/* Info Cards */}
        <section className="mt-32 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <section className="mt-16 w-full max-w-4xl">
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
