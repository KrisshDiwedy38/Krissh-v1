import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransitionContext } from '../../context/TransitionContext';

const PLANET_IMAGES: Record<string, string> = {
  sun: '/Sun-removebg-preview.png',
  mars: '/Mars-removebg-preview.png',
  earth: '/Earth-removebg-preview.png',
  jupiter: '/Jupiter-removebg-preview.png',
  saturn: '/Saturn-removebg-preview.png'
};

export default function TransitionOverlay() {
  const {
    transitionState,
    transitionPlanet,
    startCoords,
    destinationCoords,
    transitionType,
    finishTransition
  } = useTransitionContext();

  const [activePlanet, setActivePlanet] = useState<string | null>(null);

  // Sync active planet to prevent it from resetting immediately when state becomes idle
  useEffect(() => {
    if (transitionPlanet) {
      setActivePlanet(transitionPlanet);
    }
  }, [transitionPlanet]);

  if (transitionState === 'idle' || !activePlanet || transitionType === 'page-to-page' || transitionType === 'page-to-home') return null;

  const planetImg = PLANET_IMAGES[activePlanet];

  return (
    <AnimatePresence>
      {/* 1. Backdrop Overlay Mask */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: transitionState === 'departing' ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 bg-[var(--color-brand-bg)] z-[98] pointer-events-none"
      />

      {/* 2. Departure Phase (Scaling up to fullscreen) */}
      {transitionState === 'departing' && startCoords && (
        <motion.div
          key="departing-planet"
          initial={{
            position: 'fixed',
            left: startCoords.x - startCoords.size / 2,
            top: startCoords.y - startCoords.size / 2,
            width: startCoords.size,
            height: startCoords.size,
            scale: 1,
            zIndex: 99
          }}
          animate={{
            left: 'calc(50vw - 125px)',
            top: 'calc(50vh - 125px)',
            width: 250,
            height: 250,
            scale: 15
          }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1] // Matches orbital system easing curves
          }}
          className="pointer-events-none"
        >
          <img src={planetImg} alt="" className="w-full h-full object-contain" />
        </motion.div>
      )}

      {/* 3. Arrival Phase (Shrinking down to top nav destination) */}
      {transitionState === 'arriving' && destinationCoords && (
        <motion.div
          key="arriving-planet"
          initial={{
            position: 'fixed',
            left: 'calc(50vw - 125px)',
            top: 'calc(50vh - 125px)',
            width: 250,
            height: 250,
            scale: 15,
            zIndex: 99
          }}
          animate={{
            left: destinationCoords.x - destinationCoords.size / 2,
            top: destinationCoords.y - destinationCoords.size / 2,
            width: destinationCoords.size,
            height: destinationCoords.size,
            scale: 1
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onAnimationComplete={() => {
            finishTransition();
          }}
          className="pointer-events-none"
        >
          <img src={planetImg} alt="" className="w-full h-full object-contain" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
