import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { TransitionProvider, useTransitionContext } from './context/TransitionContext';
import TransitionOverlay from './components/layout/TransitionOverlay';
import TopNavStrip from './components/layout/TopNavStrip';

// Layouts
import Footer from './components/layout/Footer';
import Starfield from './components/layout/Starfield';
import Button from './components/ui/Button';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Experience = lazy(() => import('./pages/Experience'));
const Skills = lazy(() => import('./pages/Skills'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));

// Admin
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'));
const ExperienceForm = lazy(() => import('./pages/admin/ExperienceForm'));

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <div className="text-white text-center p-8 font-pixel">LOADING AUTHORIZATION...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <>{children}</>;
};

function AuthCluster() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    if (isLoading) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-3 items-center">
            {isAuthenticated ? (
                <>
                    <Button
                        onClick={() => navigate('/admin')}
                        variant="nav"
                        className="bg-white text-black"
                    >
                        Admin
                    </Button>
                </>
            ) : (
                <Button
                    onClick={() => navigate('/admin')}
                    variant="nav"
                    className="bg-[var(--color-brand-primary)] text-black"
                >
                    Login
                </Button>
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
        <Button
            onClick={handleClick}
            variant="nav"
            className="fixed top-4 left-4 z-50 bg-white text-black"
        >
            Home
        </Button>
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

function GlobalStarfield() {
    return <Starfield />;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="popLayout">
            <Suspense fallback={<div className="text-white text-center p-8 font-pixel h-screen flex items-center justify-center">LOADING SECURE CHANNEL...</div>}>
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
            </Suspense>
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
                        <GlobalStarfield />
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
