import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

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
        
        // Convert comma separated string to JSON array string for DRF
        const techArray = formData.tech_stack.split(',').map(t => t.trim()).filter(t => t);
        // Since DRF expects a JSON string or multiple fields, we can send it as a JSON string
        fd.append('tech_stack', JSON.stringify(techArray));
        
        if (formData.github_url) fd.append('github_url', formData.github_url);
        if (formData.live_url) fd.append('live_url', formData.live_url);
        fd.append('status', formData.status);
        fd.append('category', formData.category);
        fd.append('order', String(formData.order));
        
        if (thumbnail) {
            fd.append('thumbnail', thumbnail);
        }

        try {
            if (isEdit) {
                // PATCH request handles partial updates, including files
                await api.patch(`/admin/projects/${id}/`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/admin/projects/`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-[#161625] p-8 rounded-xl border border-gray-800">
                <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Project' : 'New Project'}</h1>
                
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white min-h-[100px]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack (comma separated)</label>
                        <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="React, Django, PostgreSQL" className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                            <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Live URL</label>
                            <input type="url" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white">
                                <option value="WEB">Web</option>
                                <option value="ML">ML</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Order</label>
                            <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail</label>
                        <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files ? e.target.files[0] : null)} className="w-full text-gray-400" />
                    </div>
                    <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
