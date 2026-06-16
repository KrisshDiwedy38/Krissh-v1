import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import api from '../api';

export default function Portfolio() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    
    const [projects, setProjects] = useState([]);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, expRes] = await Promise.all([
                    api.get('/projects/'),
                    api.get('/experience/')
                ]);
                setProjects(projRes.data);
                setExperience(expRes.data);
            } catch (err) {
                console.error("Failed to fetch public data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-gray-100 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full border-b border-white/5">
                <div className="w-24"></div> {/* Spacer for center alignment */}
                <div className="flex items-center justify-center">
                    {/* Placeholder Emoji/Avatar */}
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl border border-gray-700 shadow-inner">
                        😎
                    </div>
                </div>
                <div className="w-24 flex justify-end">
                    {isAuthenticated ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                            >
                                Admin
                            </button>
                            <button 
                                onClick={logout}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsLoginOpen(true)}
                            className="px-5 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-indigo-500/50 rounded-full transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                        HELLO, I'M <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">KRISSH</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-lg">
                        CS Undergraduate · Developer · Builder
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 p-1">
                        <div className="w-full h-full bg-[#161625] rounded-[22px] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
                            <span className="text-gray-600 text-sm">Image Placeholder</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Pills */}
            <section className="max-w-3xl mx-auto px-6 pb-24">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {['About Me', 'Skills', 'Projects', 'Experience', 'Contact Me'].map((item) => (
                        <a 
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="px-6 py-2.5 rounded-full bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all font-medium text-sm"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
                    Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <p className="text-gray-500">No projects published yet.</p>
                    ) : (
                        projects.map((p: any) => (
                            <div key={p.id} className="bg-[#161625] border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-colors group">
                                <div className="h-48 bg-gray-900 w-full relative">
                                    {p.thumbnail ? (
                                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Thumbnail</div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.tech_stack?.map((tech: string) => (
                                            <span key={tech} className="px-2.5 py-1 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="max-w-6xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
                    Experience
                </h2>
                <div className="space-y-6">
                    {experience.length === 0 ? (
                        <p className="text-gray-500">No experience published yet.</p>
                    ) : (
                        experience.map((e: any) => (
                            <div key={e.id} className="flex gap-6 p-6 rounded-2xl bg-[#161625] border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                    {e.logo ? (
                                        <img src={e.logo} alt={e.company} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-gray-600 text-xs">Logo</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{e.role}</h3>
                                    <p className="text-indigo-400 font-medium mb-1">{e.company}</p>
                                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">
                                        {e.start_date} — {e.end_date || 'Present'}
                                    </p>
                                    <p className="text-gray-400 text-sm leading-relaxed">{e.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 mt-12 text-center text-sm text-gray-500 font-medium">
                © 2025 Krissh. All rights reserved. Hope to work with you!
            </footer>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}
