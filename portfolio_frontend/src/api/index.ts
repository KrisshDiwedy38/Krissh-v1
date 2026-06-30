import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for receiving httpOnly cookies
});

// We can store the access token in memory
let accessToken = '';

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request Interceptor: Attach the access token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 Unauthorized and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // The refresh token is in the httpOnly cookie, so we don't send anything in the body
                // Wait, Django REST framework simple jwt requires refresh in body unless custom
                // Wait, our custom view CookieTokenRefreshView reads it from the cookie.
                const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {}, {
                    withCredentials: true
                });
                
                if (res.data.access) {
                    setAccessToken(res.data.access);
                    originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch (err) {
                // Refresh failed, user needs to login again
                setAccessToken('');
                // Optionally dispatch a custom event here to log out globally
                window.dispatchEvent(new Event('auth-expired'));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
