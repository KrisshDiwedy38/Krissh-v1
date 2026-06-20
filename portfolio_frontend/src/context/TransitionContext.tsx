import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type TransitionState = 'idle' | 'departing' | 'arriving';
export type TransitionType = 'home-to-page' | 'page-to-home' | 'page-to-page';

export interface Coords {
  x: number;
  y: number;
  size: number;
}

interface TransitionContextProps {
  transitionState: TransitionState;
  transitionPlanet: string | null;
  startCoords: Coords | null;
  destinationCoords: Coords | null;
  transitionType: TransitionType | null;
  transitionDirection: 'left' | 'right' | null;
  triggerTransition: (planetId: string, coords: Coords, targetPath: string, direction?: 'left' | 'right' | null) => void;
  registerDestination: (coords: Coords) => void;
  setArrivingState: (planetId: string) => void;
  finishTransition: () => void;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionContext must be used within a TransitionProvider');
  }
  return context;
};

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [transitionPlanet, setTransitionPlanet] = useState<string | null>(null);
  const [startCoords, setStartCoords] = useState<Coords | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coords | null>(null);
  const [transitionType, setTransitionType] = useState<TransitionType | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);



  const triggerTransition = (
    planetId: string, 
    coords: Coords, 
    targetPath: string, 
    direction: 'left' | 'right' | null = null
  ) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine transition type based on origin and target paths
    const fromPath = location.pathname;
    let type: TransitionType = 'page-to-page';
    if (fromPath === '/' && targetPath !== '/') {
      type = 'home-to-page';
    } else if (fromPath !== '/' && targetPath === '/') {
      type = 'page-to-home';
    }

    if (prefersReducedMotion) {
      setTransitionState('idle');
      setTransitionPlanet(null);
      setStartCoords(null);
      setDestinationCoords(null);
      setTransitionType(null);
      setTransitionDirection(null);
      navigate(targetPath);
      return;
    }

    setTransitionPlanet(planetId);
    setStartCoords(coords);
    setTransitionType(type);
    setTransitionDirection(direction);
    setTransitionState('departing');
    setDestinationCoords(null); // Reset from previous navigation

    if (type === 'page-to-page') {
      // Swapping immediately triggers horizontal slides
      setTimeout(() => {
        navigate(targetPath);
      }, 50);
    } else {
      // Home <-> Page uses scaling planet overlay curtain
      // Route swap happens at 350ms (midway through expand) to sync content slide-up/down
      setTimeout(() => {
        navigate(targetPath);
      }, 350);
    }
  };

  const registerDestination = (coords: Coords) => {
    setDestinationCoords(coords);
  };

  const setArrivingState = (planetId: string) => {
    setTransitionPlanet(planetId);
    setTransitionState('arriving');
  };

  const finishTransition = () => {
    setTransitionState('idle');
    setTransitionPlanet(null);
    setStartCoords(null);
    setDestinationCoords(null);
    setTransitionType(null);
    setTransitionDirection(null);
  };

  return (
    <TransitionContext.Provider
      value={{
        transitionState,
        transitionPlanet,
        startCoords,
        destinationCoords,
        transitionType,
        transitionDirection,
        triggerTransition,
        registerDestination,
        setArrivingState,
        finishTransition
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};
