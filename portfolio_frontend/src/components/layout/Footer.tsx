export default function Footer() {
  return (
    <footer 
      className="mt-32 border-t-[3px] border-[var(--color-brand-border-muted)] relative z-10"
      style={{
        backgroundColor: 'rgba(5, 5, 21, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col items-center text-center gap-6">

        {/* Name / Brand Link */}
        <a
          href="/"
          className="font-pixel text-2xl md:text-3xl text-[var(--color-brand-secondary)] hover:text-[var(--color-brand-primary)] transition-colors leading-relaxed min-h-[44px] flex items-center justify-center p-2"
        >
          KRISSH DIWEDY
        </a>

        {/* Copyright */}
        <p className="font-sans text-xs text-[var(--color-brand-text)] opacity-40 uppercase tracking-widest">
          © {new Date().getFullYear()} Krissh Diwedy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
