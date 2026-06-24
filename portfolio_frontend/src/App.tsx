import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { TransitionProvider, useTransitionContext } from './context/TransitionContext';
import TransitionOverlay from './components/layout/TransitionOverlay';
import TopNavStrip from './components/layout/TopNavStrip';

// Layouts
import Footer from './components/layout/Footer';
import Starfield from './components/layout/Starfield';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Admin
import Dashboard from './pages/admin/Dashboard';
import ProjectForm from './pages/admin/ProjectForm';
import ExperienceForm from './pages/admin/ExperienceForm';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <>{children}</>;
};

function AuthCluster() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-3 items-center">
            {isAuthenticated ? (
                <>
                    <button
                        onClick={() => navigate('/admin')}
                        className="min-h-[44px] flex items-center justify-center bg-white text-black px-4 py-2 border-[3px] border-black font-pixel uppercase text-[10px] sm:text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
                    >
                        Admin
                    </button>
                </>
            ) : (
                <button
                    onClick={() => navigate('/admin')}
                    className="min-h-[44px] flex items-center justify-center bg-[var(--color-brand-primary)] text-black px-4 py-2 border-[3px] border-black font-pixel uppercase text-[10px] sm:text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
                >
                    Login
                </button>
            )}
        </div>
    );
}

function HomeButton() {
    const location = useLocation();
    const { triggerTransition, destinationCoords } = useTransitionContext();

    // Only render on non-home pages
    if (location.pathname === '/') return null;

    const handleClick = () => {
        const NAV_PLANETS = [
            { id: 'sun', path: '/about' },
            { id: 'mars', path: '/skills' },
            { id: 'earth', path: '/contact' },
            { id: 'jupiter', path: '/experience' },
            { id: 'saturn', path: '/projects' }
        ];
        const currentPlanet = NAV_PLANETS.find(p => p.path === location.pathname);
        const planetId = currentPlanet ? currentPlanet.id : 'sun';

        const fallbackCoords = {
            x: window.innerWidth / 2,
            y: 84,
            size: window.innerWidth < 768 ? 180 : 280
        };

        const startCoords = destinationCoords || fallbackCoords;

        triggerTransition(planetId, startCoords, '/');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed top-4 left-4 z-50 min-h-[44px] flex items-center justify-center bg-white text-black px-4 py-2 border-[3px] border-black font-pixel uppercase text-[10px] sm:text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
        >
            Home
        </button>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function GlobalTopNav() {
    const location = useLocation();
    const portfolioPaths = ['/about', '/skills', '/experience', '/projects', '/contact'];
    if (!portfolioPaths.includes(location.pathname)) return null;
    return <TopNavStrip />;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="popLayout">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin/projects/new" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
                <Route path="/admin/projects/:id/edit" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
                <Route path="/admin/experience/new" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
                <Route path="/admin/experience/:id/edit" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <TransitionProvider>
                    <div className="flex flex-col min-h-screen relative z-0">
                        <Starfield />
                        <HomeButton />
                        <AuthCluster />
                        <TransitionOverlay />
                        <GlobalTopNav />
                        <main className="flex-grow pt-8 relative z-0">
                            <AnimatedRoutes />
                        </main>
                        <Footer />
                    </div>
                </TransitionProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
