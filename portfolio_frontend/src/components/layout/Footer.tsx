export default function Footer() {
  return (
    <footer className="mt-32 bg-[var(--color-brand-bg)] border-t-[3px] border-[var(--color-brand-border-muted)]">
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col items-center text-center gap-6">

        {/* Name / Brand Link */}
        <a
          href="/"
          className="font-pixel text-2xl md:text-3xl text-[var(--color-brand-secondary)] hover:text-[var(--color-brand-primary)] transition-colors leading-relaxed"
        >
          KRISSH DIWEDY
        </a>

        {/* Social Links */}
        <div className="flex gap-8">
          {['TWITTER', 'GITHUB', 'DRIBBBLE'].map((social) => (
            <a
              key={social}
              href="#"
              className="font-sans font-bold text-sm uppercase text-[var(--color-brand-text)] opacity-60 hover:opacity-100 hover:text-[var(--color-brand-primary)] transition-colors"
            >
              {social}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-sans text-xs text-[var(--color-brand-text)] opacity-40 uppercase tracking-widest">
          © {new Date().getFullYear()} Krissh Diwedy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
