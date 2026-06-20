import React from 'react';
import { motion } from 'framer-motion';
import { useTransitionContext } from '../../context/TransitionContext';

export default function PageTransition({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const { transitionType, transitionDirection, transitionState, finishTransition } = useTransitionContext();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Default fade fallback if reduced motion is requested
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        onAnimationComplete={() => {
          if (transitionType === 'page-to-page' && transitionState === 'arriving') {
            finishTransition();
          } else if (transitionType === 'page-to-home') {
            finishTransition();
          }
        }}
        className={`min-h-screen flex flex-col ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  let initial = {};
  let animate = {};
  let exit = {};
  let transition = {};

  if (transitionType === 'home-to-page') {
    // Zoom-fill entry: slide up from below
    initial = { opacity: 0, y: 150 };
    animate = { opacity: 1, y: 0 };
    exit = { opacity: 0, scale: 1.02, position: 'absolute', width: '100%' };
    transition = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] };
  } else if (transitionType === 'page-to-home') {
    // Simple fade
    initial = { opacity: 0 };
    animate = { opacity: 1 };
    exit = { opacity: 0, position: 'absolute', width: '100%' };
    transition = { duration: 0.3, ease: 'easeOut' };
  } else if (transitionType === 'page-to-page') {
    // Horizontal sliding page transition
    if (transitionDirection === 'left') {
      // Shifting clockwise: new page slides in from left, old page exits to right
      initial = { opacity: 0, x: '-100%' };
      animate = { opacity: 1, x: 0 };
      exit = { opacity: 0, x: '100%', position: 'absolute', width: '100%' };
    } else {
      // Shifting counter-clockwise: new page slides in from right, old page exits to left
      initial = { opacity: 0, x: '100%' };
      animate = { opacity: 1, x: 0 };
      exit = { opacity: 0, x: '-100%', position: 'absolute', width: '100%' };
    }
    transition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };
  } else {
    // Fallback standard transitions
    initial = { opacity: 0, scale: 0.98 };
    animate = { opacity: 1, scale: 1 };
    exit = { opacity: 0, scale: 1.02, position: 'absolute', width: '100%' };
    transition = { duration: 0.3, ease: 'easeOut' };
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      onAnimationComplete={() => {
        if (transitionType === 'page-to-page' && transitionState === 'arriving') {
          finishTransition();
        } else if (transitionType === 'page-to-home') {
          finishTransition();
        }
      }}
      className={`min-h-screen flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
