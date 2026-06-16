import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { setAccessToken } from '../api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (access: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initial check to see if we can refresh and get an access token silently
    useEffect(() => {
        const silentRefresh = async () => {
            try {
                const res = await api.post('/auth/token/refresh/');
                if (res.data.access) {
                    setAccessToken(res.data.access);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                // Not authenticated or refresh token missing/expired
                setIsAuthenticated(false);
            }
        };
        silentRefresh();

        const handleAuthExpired = () => setIsAuthenticated(false);
        window.addEventListener('auth-expired', handleAuthExpired);
        return () => window.removeEventListener('auth-expired', handleAuthExpired);
    }, []);

    const login = (access: string) => {
        setAccessToken(access);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout/');
        } catch (e) {
            console.error('Logout failed', e);
        } finally {
            setAccessToken('');
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
