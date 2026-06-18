import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`min-h-screen flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
