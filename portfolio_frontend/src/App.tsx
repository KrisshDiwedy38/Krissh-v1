import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Navbar from './components/layout/Navbar';
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

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
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
                <div className="flex flex-col min-h-screen relative z-0">
                    <Starfield />
                    <Navbar />
                    <main className="flex-grow">
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
