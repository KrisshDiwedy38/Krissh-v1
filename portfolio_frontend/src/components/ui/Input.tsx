import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="font-sans font-bold text-[var(--color-brand-text)] uppercase tracking-wide text-sm">{label}</label>}
      <input 
        className={`bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] text-[var(--color-brand-text)] p-3 font-sans 
        focus:outline-none focus:border-[var(--color-brand-primary)] focus:shadow-[4px_4px_0px_0px_var(--color-brand-primary)] 
        transition-all placeholder:text-gray-500
        ${error ? '!border-[var(--color-brand-error)] focus:!shadow-[4px_4px_0px_0px_var(--color-brand-error)]' : ''}`}
        {...props}
      />
      {error && <span className="text-[var(--color-brand-error)] font-sans text-sm font-bold">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <label className="font-sans font-bold text-[var(--color-brand-text)] uppercase tracking-wide text-sm">{label}</label>}
        <textarea 
          className={`bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] text-[var(--color-brand-text)] p-3 font-sans min-h-[120px]
          focus:outline-none focus:border-[var(--color-brand-primary)] focus:shadow-[4px_4px_0px_0px_var(--color-brand-primary)] 
          transition-all placeholder:text-gray-500
          ${error ? '!border-[var(--color-brand-error)] focus:!shadow-[4px_4px_0px_0px_var(--color-brand-error)]' : ''}`}
          {...props}
        />
        {error && <span className="text-[var(--color-brand-error)] font-sans text-sm font-bold">{error}</span>}
      </div>
    );
  }
