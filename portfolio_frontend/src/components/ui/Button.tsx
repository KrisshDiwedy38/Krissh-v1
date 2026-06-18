import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  
  const baseClasses = "px-6 py-3 font-sans font-bold text-lg tracking-wide uppercase transition-all duration-75 outline-none";
  const primaryClasses = "bg-[var(--color-brand-primary)] text-black border-[3px] border-black shadow-[6px_6px_0px_0px_var(--color-brand-secondary)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-secondary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_var(--color-brand-secondary)]";
  const secondaryClasses = "bg-transparent text-[var(--color-brand-text)] border-[3px] border-white shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_var(--color-brand-primary)]";

  return (
    <button 
      className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses} ${className} disabled:opacity-50 disabled:pointer-events-none`}
      {...props}
    >
      {children}
    </button>
  );
}
