import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'nav';
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isNav = variant === 'nav';
  
  const baseClasses = isNav ? 
    "min-h-[44px] flex items-center justify-center font-pixel uppercase text-[10px] sm:text-xs outline-none" : 
    "px-4 py-2 md:px-6 md:py-3 font-sans font-bold text-sm md:text-lg tracking-wide uppercase transition-all duration-75 outline-none";
  
  const primaryClasses = "bg-[var(--color-brand-primary)] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_var(--color-brand-secondary)] md:shadow-[6px_6px_0px_0px_var(--color-brand-secondary)] hover:translate-x-[2px] hover:translate-y-[2px] md:hover:translate-x-[4px] md:hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-secondary)] md:hover:shadow-[2px_2px_0px_0px_var(--color-brand-secondary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";
  const secondaryClasses = "bg-transparent text-[var(--color-brand-text)] border-[3px] border-white shadow-[4px_4px_0px_0px_var(--color-brand-primary)] md:shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:translate-x-[2px] hover:translate-y-[2px] md:hover:translate-x-[4px] md:hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_var(--color-brand-primary)] md:hover:shadow-[2px_2px_0px_0px_var(--color-brand-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";
  const navClasses = "px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer";

  let finalClasses = baseClasses;
  if (isPrimary) finalClasses += ` ${primaryClasses}`;
  else if (isNav) finalClasses += ` ${navClasses}`;
  else finalClasses += ` ${secondaryClasses}`;

  return (
    <button 
      className={`${finalClasses} ${className} disabled:opacity-50 disabled:pointer-events-none`}
      {...props}
    >
      {children}
    </button>
  );
}
