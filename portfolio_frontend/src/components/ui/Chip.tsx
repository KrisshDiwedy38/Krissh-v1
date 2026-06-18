

interface ChipProps {
  label: string;
  className?: string;
}

export default function Chip({ label, className = '' }: ChipProps) {
  // Use pixel font if under 8 chars, else Space Grotesk
  const usePixelFont = label.length < 8;

  return (
    <span 
      className={`inline-block border-[2px] border-[var(--color-brand-border-muted)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--color-brand-text)] bg-[var(--color-brand-surface-2)] ${usePixelFont ? 'font-pixel text-[10px] leading-tight' : 'font-sans font-bold'} ${className}`}
    >
      {label}
    </span>
  );
}
