import { useState, useEffect } from 'react';
import api from '../../api';
import Button from '../../components/ui/Button';
import { FileInput } from '../../components/ui/Input';

export default function AboutMeTab() {
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [resume, setResume] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [coreSkill, setCoreSkill] = useState('');
    const [weapon, setWeapon] = useState('');
    const [base, setBase] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [currentResume, setCurrentResume] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    const fetchAbout = async () => {
        try {
            const res = await api.get('/admin/about/');
            setBio(res.data.bio || '');
            setTitle(res.data.title || '');
            setCoreSkill(res.data.core_skill || '');
            setWeapon(res.data.weapon || '');
            setBase(res.data.base || '');
            setCurrentImage(res.data.profile_image || '');
            setCurrentResume(res.data.resume || '');
        } catch (err) {
            // error silenced
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('title', title);
        formData.append('core_skill', coreSkill);
        formData.append('weapon', weapon);
        formData.append('base', base);
        if (profileImage) formData.append('profile_image', profileImage);
        if (resume) formData.append('resume', resume);

        try {
            await api.patch('/admin/about/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatusMsg({ text: 'SAVED SUCCESSFULLY!', type: 'success' });
            setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
            fetchAbout();
        } catch (err) {
            // error silenced
            setStatusMsg({ text: 'FAILED TO SAVE.', type: 'error' });
            setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-none w-full bg-[var(--color-brand-surface-2)] p-4 border-[3px] border-[var(--color-brand-border)]">
            <h2 className="font-pixel text-xl text-[var(--color-brand-primary)]">About Me</h2>
            
            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm uppercase tracking-widest">Description / Bio</label>
                <span className="text-xs text-gray-400">The introductory paragraph(s) shown on the About Me page.</span>
                <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-3 min-h-[150px] font-sans focus:outline-none focus:border-[var(--color-brand-primary)]"
                    placeholder="A creative explorer operating..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm uppercase tracking-widest">Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-3 font-sans focus:outline-none focus:border-[var(--color-brand-primary)]"
                        placeholder="e.g. The Architect"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm uppercase tracking-widest">Core Skill</label>
                    <input 
                        type="text" 
                        value={coreSkill}
                        onChange={(e) => setCoreSkill(e.target.value)}
                        className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-3 font-sans focus:outline-none focus:border-[var(--color-brand-primary)]"
                        placeholder="e.g. Celestial Neobrutalism"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm uppercase tracking-widest">Weapon (Tech)</label>
                    <input 
                        type="text" 
                        value={weapon}
                        onChange={(e) => setWeapon(e.target.value)}
                        className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-3 font-sans focus:outline-none focus:border-[var(--color-brand-primary)]"
                        placeholder="e.g. Modern Frontend & Shaders"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm uppercase tracking-widest">Base (Location/Alias)</label>
                    <input 
                        type="text" 
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-3 font-sans focus:outline-none focus:border-[var(--color-brand-primary)]"
                        placeholder="e.g. Digital Nebula 0x4"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Accepts image files. Replaces the current profile photo.</span>
                {currentImage && (
                    <img src={currentImage} alt="Current profile" className="w-32 h-32 object-cover border-[2px] border-white mb-2" />
                )}
                <FileInput 
                    label="Profile Image"
                    accept="image/*"
                    selectedFile={profileImage}
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Accepts PDF. This file becomes the download target of the Resume button.</span>
                {currentResume && (
                    <a href={currentResume} target="_blank" rel="noreferrer" className="text-sm text-blue-400 underline mb-2">View Current Resume</a>
                )}
                <FileInput 
                    label="Resume (PDF)"
                    accept="application/pdf"
                    selectedFile={resume}
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
            </div>

            <div className="flex items-center gap-4 mt-4">
                <Button type="submit" variant="primary" className="w-fit">SAVE CHANGES</Button>
                {statusMsg.text && (
                    <span className={`font-pixel text-sm animate-pulse ${statusMsg.type === 'success' ? 'text-[var(--color-brand-primary)]' : 'text-red-500'}`}>
                        {statusMsg.text}
                    </span>
                )}
            </div>
        </form>
    );
}
