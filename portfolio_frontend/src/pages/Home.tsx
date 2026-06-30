import PageTransition from '../components/layout/PageTransition';
import ASCIIHero from '../components/ASCIIHero';
import OrbitalNav from '../components/OrbitalNav';

export default function Home() {
  return (
    <PageTransition>
      <div className="w-full overflow-hidden">
        {/* Hero Section - 2 column grid */}
        <section className="min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center w-full">
            {/* Left: ASCII Portrait */}
            <div className="hidden md:flex md:justify-start">
              <ASCIIHero />
            </div>
            {/* Right: Pixel Text */}
            <div className="text-center md:text-left space-y-2">
              <h2 className="font-pixel text-3xl md:text-4xl text-white uppercase">HELLO</h2>
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
      </div>
    </PageTransition>
  );
}
