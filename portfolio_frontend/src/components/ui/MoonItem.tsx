import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';

interface MoonItemProps {
  id: string | number;
  title: string;
  subtitle?: string;
  previewImage?: string | null;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function MoonItem({ title, subtitle, previewImage, children, isExpanded, onToggle }: MoonItemProps) {

  return (
    <div className="relative w-full mx-auto my-6 lg:my-12 flex flex-col items-center">

      {/* The Moon Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer flex flex-col items-center gap-4 z-10 w-full"
            onClick={onToggle}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[4px] border-white bg-[var(--color-brand-surface-2)] shadow-[8px_8px_0px_0px_var(--color-brand-border-muted)] flex items-center justify-center overflow-hidden relative">
              {previewImage ? (
                <img src={previewImage} alt={title} className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="w-full h-full bg-[var(--color-brand-surface-3)]" />
              )}
              {/* Moon craters placeholder styling */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-black/20 mix-blend-overlay"></div>
              <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-black/20 mix-blend-overlay"></div>
            </div>
            <div className="text-center bg-[var(--color-brand-bg)] px-2">
              <h3 className="font-pixel text-sm md:text-base text-[var(--color-brand-text)]">{title}</h3>
              {subtitle && <p className="font-sans text-xs text-[var(--color-brand-primary)] mt-1 font-bold">{subtitle}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="w-full mt-4 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-pixel text-xl text-[var(--color-brand-primary)] mb-2">{title}</h3>
                  {subtitle && <p className="font-sans text-sm text-[var(--color-brand-text)] opacity-80 uppercase tracking-widest">{subtitle}</p>}
                </div>
              </div>
              <div className="w-full border-t-[2px] border-[var(--color-brand-border-muted)] pt-6">
                {children}
              </div>
              <div className="mt-8 flex justify-center border-t-[2px] border-[var(--color-brand-border-muted)] pt-6">
                <Button variant="secondary" onClick={onToggle} className="!px-6 !py-2 min-h-[44px] flex items-center justify-center font-pixel">
                  X
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
