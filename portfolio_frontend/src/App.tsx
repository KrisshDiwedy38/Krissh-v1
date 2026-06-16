import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import Dashboard from './pages/admin/Dashboard';
import ProjectForm from './pages/admin/ProjectForm';
import ExperienceForm from './pages/admin/ExperienceForm';

// Simple PrivateRoute wrapper for admin panel
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" />;
    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Portfolio />} />
                    
                    <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/admin/projects/new" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
                    <Route path="/admin/projects/:id/edit" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
                    <Route path="/admin/experience/new" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
                    <Route path="/admin/experience/:id/edit" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
