import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/layout/PageTransition';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/token/', { username, password });
            login(res.data.access);
            navigate('/admin');
        } catch (err: any) {
            setError("YOU ARE NOT KRISSH 👀 TRY AGAIN!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition className="flex items-center justify-center min-h-[100dvh]">
            <Card className="w-[calc(100%-32px)] max-w-[400px] md:max-w-[440px] lg:max-w-[480px] mx-auto relative !border-[4px] p-6 lg:p-10 shadow-[12px_12px_0px_0px_var(--color-brand-primary)]">
                
                <button 
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 text-[var(--color-brand-border-muted)] hover:text-white font-pixel text-xl transition-colors"
                >
                    X
                </button>
                
                <h2 className="font-pixel text-2xl text-[var(--color-brand-primary)] mb-8">SYSTEM LOGIN</h2>
                
                {error && (
                    <div className="mb-6 p-4 bg-[var(--color-brand-error)] text-black border-[3px] border-black font-pixel text-[10px] leading-loose text-center uppercase shadow-[4px_4px_0px_0px_black]">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full min-h-[48px] overflow-hidden text-ellipsis whitespace-nowrap flex items-center justify-center"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
                    </Button>
                </form>
            </Card>
        </PageTransition>
    );
}
