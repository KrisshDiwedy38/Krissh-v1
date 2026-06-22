import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import PageTransition from '../../components/layout/PageTransition';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input, { Textarea, FileInput } from '../../components/ui/Input';

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
        location: '',
        employment_type: 'FULL_TIME',
        status: 'DRAFT',
        order: 0,
    });
    const [isPresent, setIsPresent] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            api.get(`/admin/experience/${id}/`).then(res => {
                const data = res.data;
                setFormData({
                    company: data.company,
                    role: data.role,
                    location: data.location || '',
                    employment_type: data.employment_type || 'FULL_TIME',
                    description: data.description,
                    start_date: data.start_date,
                    end_date: data.end_date || '',
                    status: data.status,
                    order: data.order,
                });
                if (!data.end_date) setIsPresent(true);
            }).catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const fd = new FormData();
        fd.append('company', formData.company);
        fd.append('role', formData.role);
        fd.append('location', formData.location);
        fd.append('employment_type', formData.employment_type);
        fd.append('description', formData.description);
        fd.append('start_date', formData.start_date);
        if (!isPresent && formData.end_date) fd.append('end_date', formData.end_date);
        else fd.append('end_date', '');
        fd.append('status', formData.status);
        fd.append('order', String(formData.order));
        if (logo) fd.append('logo', logo);

        try {
            if (isEdit) {
                await api.patch(`/admin/experience/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post(`/admin/experience/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <PageTransition className="p-6 md:p-12 w-full max-w-3xl mx-auto">
            <h1 className="font-pixel text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-8">
                {isEdit ? 'EDIT EXPERIENCE' : 'NEW EXPERIENCE'}
            </h1>
            
            <Card>
                {error && <div className="mb-6 p-4 bg-[var(--color-brand-error)] text-white font-bold border-[3px] border-black">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Company Name" placeholder="e.g. Acme Corp" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                        <Input label="Job Title / Role" placeholder="e.g. Frontend Engineer" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Location" placeholder="e.g. Remote, San Francisco" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        <div className="flex flex-col gap-2">
                            <label className="font-sans font-bold text-sm tracking-wide uppercase">Employment Type</label>
                            <select value={formData.employment_type} onChange={e => setFormData({...formData, employment_type: e.target.value})} className="bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-3 font-sans focus:outline-none focus:border-[var(--color-brand-primary)]">
                                <option value="FULL_TIME">Full-time</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="FREELANCE">Freelance</option>
                                <option value="CONTRACT">Contract</option>
                            </select>
                        </div>
                    </div>
                    
                    <Textarea label="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Start Date" type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                        <div className="flex flex-col gap-2">
                            <label className="font-sans font-bold text-sm tracking-wide uppercase">End Date</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="date" 
                                    value={formData.end_date} 
                                    onChange={e => setFormData({...formData, end_date: e.target.value})} 
                                    disabled={isPresent}
                                    className="bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-2 font-sans focus:outline-none flex-grow disabled:opacity-50"
                                />
                                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                    <input type="checkbox" checked={isPresent} onChange={e => setIsPresent(e.target.checked)} className="w-4 h-4" />
                                    <span className="font-sans text-sm">Present</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-sans font-bold text-sm tracking-wide uppercase">Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-[var(--color-brand-bg)] border-[3px] border-[var(--color-brand-border)] p-3 focus:outline-none focus:border-[var(--color-brand-primary)] focus:shadow-[4px_4px_0px_0px_var(--color-brand-primary)]">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                        <Input label="Order" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <FileInput 
                            label="Company Logo"
                            accept="image/*"
                            selectedFile={logo}
                            onChange={e => setLogo(e.target.files ? e.target.files[0] : null)}
                        />
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
