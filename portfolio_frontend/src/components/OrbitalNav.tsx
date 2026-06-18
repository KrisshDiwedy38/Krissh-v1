import { useNavigate } from 'react-router-dom';

const ORBITS = [
  { id: 'orbit-1', size: 300, duration: 20, direction: 'normal' },
  { id: 'orbit-2', size: 450, duration: 30, direction: 'reverse' },
  { id: 'orbit-3', size: 600, duration: 45, direction: 'normal' },
];

const PLANETS = [
  {
    id: 'mars',
    orbit: 0,
    icon: 'rocket_launch',
    label: 'MARS (SKILLS)',
    path: '/skills',
    angle: 0,
  },
  {
    id: 'jupiter',
    orbit: 1,
    icon: 'terminal',
    label: 'JUPITER (EXP)',
    path: '/experience',
    angle: 60,
  },
  {
    id: 'saturn',
    orbit: 1,
    icon: 'folder_open',
    label: 'SATURN (PROJS)',
    path: '/projects',
    angle: 200,
  },
  {
    id: 'earth',
    orbit: 2,
    icon: 'public',
    label: 'EARTH (CONTACT)',
    path: '/contact',
    angle: 120,
  },
];

const CSS_KEYFRAMES = `
  @keyframes orbit-spin-1 {
    from { transform: rotateX(75deg) rotate(0deg); }
    to   { transform: rotateX(75deg) rotate(360deg); }
  }
  @keyframes orbit-spin-2 {
    from { transform: rotateX(75deg) rotate(360deg); }
    to   { transform: rotateX(75deg) rotate(0deg); }
  }
  @keyframes orbit-spin-3 {
    from { transform: rotateX(75deg) rotate(0deg); }
    to   { transform: rotateX(75deg) rotate(360deg); }
  }
  @keyframes counter-tilt-1 {
    from { transform: rotate(0deg) rotateX(-75deg); }
    to   { transform: rotate(-360deg) rotateX(-75deg); }
  }
  @keyframes counter-tilt-2 {
    from { transform: rotate(-360deg) rotateX(-75deg); }
    to   { transform: rotate(0deg) rotateX(-75deg); }
  }
  @keyframes counter-tilt-3 {
    from { transform: rotate(0deg) rotateX(-75deg); }
    to   { transform: rotate(-360deg) rotateX(-75deg); }
  }
  .orbital-planet-btn {
    width: 40px;
    height: 40px;
    background: var(--color-brand-bg);
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 6px 6px 0px 0px #ffabf3;
    transition: transform 0.2s ease, background 0.2s ease;
    position: relative;
  }
  .orbital-planet-btn:hover {
    transform: scale(1.2) translateY(-10px);
    background: var(--color-brand-primary);
  }
  .orbital-planet-btn .planet-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: var(--color-brand-text);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .orbital-planet-btn:hover .planet-label {
    opacity: 1;
  }
  .orbital-sun-btn {
    width: 80px;
    height: 80px;
    border: 4px solid var(--color-brand-primary);
    background: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(0, 251, 251, 0.4), 0 0 60px rgba(0, 251, 251, 0.2);
    transition: transform 0.2s ease;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .orbital-sun-btn:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

export default function OrbitalNav() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', height: '600px', perspective: '1000px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div dangerouslySetInnerHTML={{ __html: `<style>${CSS_KEYFRAMES}</style>` }} />

      {/* Orbit Rings */}
      {ORBITS.map((orbit, i) => (
        <div
          key={orbit.id}
          style={{
            position: 'absolute',
            width: `${orbit.size}px`,
            height: `${orbit.size}px`,
            border: '2px solid var(--color-brand-border-muted)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: `-${orbit.size / 2}px`,
            marginLeft: `-${orbit.size / 2}px`,
            animation: `orbit-spin-${i + 1} ${orbit.duration}s linear infinite ${orbit.direction}`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Planets on this orbit */}
          {PLANETS.filter((p) => p.orbit === i).map((planet) => {
            const rad = (planet.angle * Math.PI) / 180;
            const px = (orbit.size / 2) * Math.cos(rad) + orbit.size / 2 - 20;
            const py = (orbit.size / 2) * Math.sin(rad) + orbit.size / 2 - 20;
            return (
              <div
                key={planet.id}
                style={{
                  position: 'absolute',
                  left: `${px}px`,
                  top: `${py}px`,
                  animation: `counter-tilt-${i + 1} ${orbit.duration}s linear infinite ${orbit.direction}`,
                }}
              >
                <button
                  className="orbital-planet-btn"
                  onClick={() => navigate(planet.path)}
                  aria-label={planet.label}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>
                    {planet.icon}
                  </span>
                  <span className="planet-label">{planet.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      ))}

      {/* Central Sun */}
      <button
        className="orbital-sun-btn"
        onClick={() => navigate('/about')}
        aria-label="About Me"
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px', color: 'var(--color-brand-primary)' }}>
          ME
        </span>
      </button>
    </div>
  );
}
