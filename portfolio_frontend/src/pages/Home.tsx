import PageTransition from '../components/layout/PageTransition';
import ASCIIHero from '../components/ASCIIHero';
import OrbitalNav from '../components/OrbitalNav';

export default function Home() {
  return (
    <PageTransition>
      <div className="w-full">
        {/* Hero Section - 2 column grid */}
        <section className="min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-8 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
            {/* Left: ASCII Portrait */}
            <div className="flex justify-center md:justify-start">
              <ASCIIHero />
            </div>
            {/* Right: Pixel Text */}
            <div className="text-center md:text-left space-y-2">
              <h2 className="font-pixel text-3xl md:text-4xl text-white uppercase animate-pulse">HELLO</h2>
              <h1 className="font-pixel text-3xl md:text-4xl text-[var(--color-brand-secondary)] uppercase">I'M KRISSH</h1>
              <p className="font-sans text-lg text-[var(--color-brand-text)] opacity-70 max-w-md">
                A celestial traveler architecting digital systems within the vacuum of the web.
              </p>
            </div>
          </div>
        </section>

        {/* Orbital Navigation */}
        <section className="w-full">
          <OrbitalNav />
        </section>

        {/* Status Cards */}
        <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System Status */}
          <div className="neobrutal-card p-6">
            <div className="font-pixel text-base text-[var(--color-brand-primary)] mb-2">SYSTEM STATUS</div>
            <div className="h-4 w-full bg-[var(--color-brand-surface-3)] border-2 border-white overflow-hidden">
              <div className="h-full bg-[var(--color-brand-primary-tint)] w-[81%]"></div>
            </div>
            <div className="mt-2 font-sans text-xs flex justify-between text-[var(--color-brand-text)] opacity-60">
              <span>OXYGEN: 88%</span>
              <span>FUEL: OPTIMAL</span>
            </div>
          </div>
          {/* Coordinates */}
          <div className="neobrutal-card p-6">
            <div className="font-pixel text-base text-[var(--color-brand-secondary)] mb-2">COORD: 0,0,1</div>
            <p className="font-sans text-sm text-[var(--color-brand-text)] opacity-70">Navigating through the Celestial Neobrutalism sector. High fidelity detected.</p>
          </div>
          {/* Warp */}
          <div className="neobrutal-card p-6 flex items-center justify-center">
            <button className="font-pixel text-base text-[var(--color-brand-primary)] hover:underline decoration-4 underline-offset-8">INITIATE WARP</button>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
