import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

import PageTransition from '../../components/layout/PageTransition';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const res = await api.get(`/admin/${activeTab}/`);
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        try {
            await api.patch(`/admin/${activeTab}/${id}/status/`, { status: newStatus });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/admin/${activeTab}/${id}/`);
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PageTransition className="p-6 md:p-12 max-w-[1440px] mx-auto w-full">
            <header className="flex justify-between items-center mb-12 border-b-[3px] border-[var(--color-brand-border-muted)] pb-6">
                <div>
                  <h1 className="font-pixel text-2xl md:text-4xl text-[var(--color-brand-primary)]">ADMIN PANEL</h1>
                  <p className="font-sans text-sm tracking-widest uppercase mt-2 opacity-80">Command Center</p>
                </div>
            </header>

            <div className="flex gap-4 mb-8">
                <Button 
                    variant={activeTab === 'projects' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('projects')}
                    className="!py-2"
                >
                    PROJECTS
                </Button>
                <Button 
                    variant={activeTab === 'experience' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('experience')}
                    className="!py-2"
                >
                    EXPERIENCE
                </Button>
                <div className="flex-1"></div>
                <Button 
                    variant="primary"
                    onClick={() => navigate(`/admin/${activeTab}/new`)}
                    className="!py-2 !bg-[var(--color-brand-secondary)] !text-white !shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)] active:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)]"
                >
                    + NEW
                </Button>
            </div>

            <Card className="w-full overflow-x-auto !p-0">
                <table className="w-full text-left font-sans">
                    <thead className="bg-[var(--color-brand-surface-2)] border-b-[3px] border-[var(--color-brand-border)]">
                        <tr>
                            <th className="p-4 font-bold text-sm tracking-widest uppercase">Title / Role</th>
                            <th className="p-4 font-bold text-sm tracking-widest uppercase">Status</th>
                            <th className="p-4 font-bold text-sm tracking-widest uppercase">Order</th>
                            <th className="p-4 font-bold text-sm tracking-widest uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No entries found in database.</td>
                            </tr>
                        ) : (
                            items.map((item, i) => (
                                <tr key={item.id} className={i !== items.length - 1 ? "border-b-[2px] border-[var(--color-brand-border-muted)]" : ""}>
                                    <td className="p-4 font-bold">
                                        {activeTab === 'projects' ? item.title : `${item.role} @ ${item.company}`}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block border-[2px] border-[var(--color-brand-border)] px-2 py-1 text-xs font-bold ${item.status === 'PUBLISHED' ? 'bg-[#44ff44] text-black' : 'bg-gray-600 text-white'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{item.order}</td>
                                    <td className="p-4 text-right flex justify-end gap-3">
                                        <button onClick={() => handleToggleStatus(item.id, item.status)} className="text-xs font-bold hover:text-[var(--color-brand-primary)] uppercase underline underline-offset-4">Toggle</button>
                                        <button onClick={() => navigate(`/admin/${activeTab}/${item.id}/edit`)} className="text-xs font-bold hover:text-[var(--color-brand-tertiary)] uppercase underline underline-offset-4">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-[var(--color-brand-error)] hover:text-red-400 uppercase underline underline-offset-4">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </PageTransition>
    );
}
