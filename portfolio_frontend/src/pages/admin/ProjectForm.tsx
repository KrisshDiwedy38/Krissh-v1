import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import PageTransition from '../../components/layout/PageTransition';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input, { Textarea } from '../../components/ui/Input';

export default function ProjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        status: 'DRAFT',
        category: 'OTHER',
        order: 0,
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            api.get(`/admin/projects/${id}/`).then(res => {
                const data = res.data;
                setFormData({
                    title: data.title,
                    description: data.description,
                    tech_stack: data.tech_stack.join(', '),
                    github_url: data.github_url || '',
                    live_url: data.live_url || '',
                    status: data.status,
                    category: data.category,
                    order: data.order,
                });
            }).catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        const techArray = formData.tech_stack.split(',').map(t => t.trim()).filter(t => t);
        fd.append('tech_stack', JSON.stringify(techArray));
        if (formData.github_url) fd.append('github_url', formData.github_url);
        if (formData.live_url) fd.append('live_url', formData.live_url);
        fd.append('status', formData.status);
        fd.append('category', formData.category);
        fd.append('order', String(formData.order));
        if (thumbnail) fd.append('thumbnail', thumbnail);

        try {
            if (isEdit) {
                await api.patch(`/admin/projects/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post(`/admin/projects/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <PageTransition className="p-6 md:p-12 w-full max-w-3xl mx-auto">
            <h1 className="font-pixel text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-8">
                {isEdit ? 'EDIT PROJECT' : 'NEW PROJECT'}
            </h1>
            
            <Card>
                {error && <div className="mb-6 p-4 bg-[var(--color-brand-error)] text-white font-bold border-[3px] border-black">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input label="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    
                    <Textarea label="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    
                    <Input label="Tech Stack (comma separated)" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="GitHub URL" type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} />
                        <Input label="Live URL" type="url" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-sans font-bold text-sm tracking-wide uppercase">Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-3 focus:outline-none focus:border-[var(--color-brand-primary)] focus:shadow-[4px_4px_0px_0px_var(--color-brand-primary)]">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-sans font-bold text-sm tracking-wide uppercase">Category</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-3 focus:outline-none focus:border-[var(--color-brand-primary)] focus:shadow-[4px_4px_0px_0px_var(--color-brand-primary)]">
                                <option value="WEB">Web</option>
                                <option value="ML">ML</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <Input label="Order" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-sans font-bold text-sm tracking-wide uppercase">Thumbnail Image</label>
                        <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files ? e.target.files[0] : null)} className="font-sans" />
                    </div>
                    
                    <div className="pt-6 flex justify-end gap-4 border-t-[3px] border-[var(--color-brand-border-muted)]">
                        <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Card>
        </PageTransition>
    );
}
