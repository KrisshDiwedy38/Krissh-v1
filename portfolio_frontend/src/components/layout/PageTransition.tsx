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
    initial = { opacity: 0, y: 100 };
    animate = { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] } };
    exit = { opacity: 0, position: 'absolute', width: '100%', transition: { duration: 0.2, ease: [0.4, 0.0, 1, 1] } };
    transition = {};
  } else if (transitionType === 'page-to-home') {
    // Simple fade out page, Home fades in
    initial = { opacity: 0 };
    animate = { opacity: 1, transition: { duration: 0.3, ease: 'easeOut', delay: 0.1 } };
    exit = { opacity: 0, position: 'absolute', width: '100%', transition: { duration: 0.2, ease: 'easeIn' } };
    transition = {};
  } else if (transitionType === 'page-to-page') {
    // Spatial page transition
    if (transitionDirection === 'left') {
      initial = { opacity: 0, x: '-50px' };
      animate = { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] } };
      exit = { opacity: 0, x: '50px', position: 'absolute', width: '100%', transition: { duration: 0.2, ease: [0.4, 0.0, 1, 1] } };
    } else {
      initial = { opacity: 0, x: '50px' };
      animate = { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] } };
      exit = { opacity: 0, x: '-50px', position: 'absolute', width: '100%', transition: { duration: 0.2, ease: [0.4, 0.0, 1, 1] } };
    }
    transition = {}; // Handled per-property above
  } else {
    // Fallback standard transitions (e.g. Portfolio <-> Admin)
    initial = { opacity: 0 };
    animate = { opacity: 1, transition: { duration: 0.25, ease: 'easeIn', delay: 0.1 } };
    exit = { opacity: 0, position: 'absolute', width: '100%', transition: { duration: 0.2, ease: 'easeOut' } };
    transition = {}; // Handled per-property above
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
