import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

export default function ExperienceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'DRAFT',
        order: 0,
    });
    const [logo, setLogo] = useState<File | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            api.get(`/admin/experience/${id}/`).then(res => {
                const data = res.data;
                setFormData({
                    company: data.company,
                    role: data.role,
                    description: data.description,
                    start_date: data.start_date,
                    end_date: data.end_date || '',
                    status: data.status,
                    order: data.order,
                });
            }).catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const fd = new FormData();
        fd.append('company', formData.company);
        fd.append('role', formData.role);
        fd.append('description', formData.description);
        fd.append('start_date', formData.start_date);
        if (formData.end_date) fd.append('end_date', formData.end_date);
        fd.append('status', formData.status);
        fd.append('order', String(formData.order));
        
        if (logo) {
            fd.append('logo', logo);
        }

        try {
            if (isEdit) {
                await api.patch(`/admin/experience/${id}/`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/admin/experience/`, fd, {
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
                <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Experience' : 'New Experience'}</h1>
                
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                            <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                            <input required type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date (leave blank if current)</label>
                            <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Order</label>
                            <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company Logo</label>
                        <input type="file" accept="image/*" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} className="w-full text-gray-400" />
                    </div>
                    <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Experience</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
