import { useEffect, useState, useRef } from 'react';

const generateStars = (count: number, color: string = '#FFF') => {
  let boxShadow = '';
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    boxShadow += `${x}vw ${y}vh ${color}`;
    if (i < count - 1) boxShadow += ', ';
  }
  return boxShadow;
};

interface ShootingStar {
  id: number;
  top: number;
  left: number;
  duration: number;
}

export default function Starfield() {
  const [starsTiny, setStarsTiny] = useState('');
  const [starsSmall, setStarsSmall] = useState('');
  const [starsMedium, setStarsMedium] = useState('');
  const [starsLarge, setStarsLarge] = useState('');
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    // Generate static stars of various sizes and tints
    setStarsTiny(generateStars(300, '#ffffff'));
    setStarsSmall(generateStars(150, '#e0e0ff')); // Slight blue tint
    setStarsMedium(generateStars(50, '#ffe0ff')); // Slight purple tint
    setStarsLarge(generateStars(15, '#ffffff'));

    let isActive = true;

    const spawnShootingStar = () => {
      if (!isActive) return;

      const newStar = {
        id: Date.now(),
        top: Math.random() * 40, // 0 to 40vh (upper half)
        left: 40 + Math.random() * 60, // 40 to 100vw (right half)
        duration: 1 + Math.random() * 1.5, // 1s to 2.5s duration
      };

      setShootingStars(prev => [...prev, newStar]);

      // Remove the star after its animation completes
      const removeTimeout = setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, newStar.duration * 1000 + 200);
      timeoutsRef.current.push(removeTimeout);

      // Schedule the next star
      const nextSpawn = 2000 + Math.random() * 8000; // 2s to 10s delay
      const nextTimeout = setTimeout(spawnShootingStar, nextSpawn);
      timeoutsRef.current.push(nextTimeout);
    };

    // Start the shooting star loop
    const initialTimeout = setTimeout(spawnShootingStar, Math.random() * 3000);
    timeoutsRef.current.push(initialTimeout);

    return () => {
      isActive = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050510]">
      <style>
        {`
          @keyframes twinkle-1 {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
          @keyframes twinkle-2 {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 1; }
          }
          @keyframes twinkle-3 {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
          @keyframes shooting-star-anim {
            0% {
              transform: rotate(135deg) translateX(0);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: rotate(135deg) translateX(150vw);
              opacity: 0;
            }
          }
          
          .stars-tiny {
            width: 1px;
            height: 1px;
            background: transparent;
            animation: twinkle-1 4s infinite ease-in-out;
          }
          .stars-small {
            width: 2px;
            height: 2px;
            background: transparent;
            animation: twinkle-2 6s infinite ease-in-out 1s;
          }
          .stars-medium {
            width: 3px;
            height: 3px;
            background: transparent;
            animation: twinkle-3 8s infinite ease-in-out 2s;
          }
          .stars-large {
            width: 4px;
            height: 4px;
            background: transparent;
            animation: twinkle-2 10s infinite ease-in-out 3s;
          }
          .shooting-star {
            position: absolute;
            width: 120px;
            height: 2px;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            border-radius: 50%;
            filter: drop-shadow(0 0 6px #fff);
            opacity: 0;
            will-change: transform, opacity;
          }
        `}
      </style>

      {/* Ambient Space Clouds (Purple and Blue) */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle at 20% 30%, #4b0082 0%, transparent 40%), radial-gradient(circle at 80% 60%, #00008b 0%, transparent 50%), radial-gradient(circle at 40% 80%, #29004d 0%, transparent 40%), radial-gradient(circle at 90% 10%, #3d0066 0%, transparent 30%)' }}>
      </div>

      {/* Star layers */}
      {starsTiny && <div className="stars-tiny" style={{ boxShadow: starsTiny }}></div>}
      {starsSmall && <div className="stars-small" style={{ boxShadow: starsSmall }}></div>}
      {starsMedium && <div className="stars-medium" style={{ boxShadow: starsMedium }}></div>}
      {starsLarge && <div className="stars-large" style={{ boxShadow: starsLarge }}></div>}

      {/* Shooting Stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            animation: `shooting-star-anim ${star.duration}s linear forwards`
          }}
        />
      ))}
    </div>
  );
}
