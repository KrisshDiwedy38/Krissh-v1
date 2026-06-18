import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'EXPERIENCE', path: '/experience' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--color-brand-bg)] border-b-[3px] border-white">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left: Nav Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`font-sans text-sm uppercase tracking-wider px-4 py-2 transition-colors ${
                isActive(link.path)
                  ? 'text-[var(--color-brand-primary)] font-bold'
                  : 'text-[var(--color-brand-text)] opacity-70 hover:opacity-100 hover:bg-[var(--color-brand-primary)] hover:text-black'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile: Hamburger */}
        <button className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10">
          <span className="block w-6 h-[3px] bg-white" />
          <span className="block w-6 h-[3px] bg-white" />
          <span className="block w-6 h-[3px] bg-white" />
        </button>

        {/* Right: Auth Actions */}
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/admin')}
                className="font-sans font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] uppercase text-sm tracking-widest"
              >
                Admin
              </button>
              <button
                onClick={logout}
                className="bg-[var(--color-brand-primary)] text-black px-6 py-2 border-[3px] border-black font-sans font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/admin')}
              className="bg-[var(--color-brand-primary)] text-black px-6 py-2 border-[3px] border-black font-sans font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
