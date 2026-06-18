import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
  children: React.ReactNode;
}

export default function Card({ featured = false, className = '', children, ...props }: CardProps) {
  const baseClasses = "bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-6";
  const featuredClasses = featured ? "shadow-[6px_6px_0px_0px_var(--color-brand-secondary)]" : "";
  
  return (
    <div className={`${baseClasses} ${featuredClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
