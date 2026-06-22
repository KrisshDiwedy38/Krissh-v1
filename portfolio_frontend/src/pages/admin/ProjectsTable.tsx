import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Card from '../../components/ui/Card';

export default function ProjectsTable() {
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const res = await api.get('/admin/projects/');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        try {
            await api.patch(`/admin/projects/${id}/status/`, { status: newStatus });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/admin/projects/${id}/`);
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="w-full overflow-x-auto !p-0">
            <table className="w-full text-left font-sans">
                <thead className="bg-[var(--color-brand-surface-2)] border-b-[3px] border-[var(--color-brand-border)]">
                    <tr>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Title</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase hidden md:table-cell">Tech Stack</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Status</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Featured</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Order</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No entries found.</td>
                        </tr>
                    ) : (
                        items.map((item, i) => (
                            <tr key={item.id} className={i !== items.length - 1 ? "border-b-[2px] border-[var(--color-brand-border-muted)]" : ""}>
                                <td className="p-4 font-bold">{item.title}</td>
                                <td className="p-4 hidden md:table-cell text-xs opacity-80">
                                    {Array.isArray(item.tech_stack) ? item.tech_stack.slice(0,3).join(', ') + (item.tech_stack.length > 3 ? '...' : '') : ''}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-block border-[2px] border-[var(--color-brand-border)] px-2 py-1 text-xs font-bold ${item.status === 'PUBLISHED' ? 'bg-[#44ff44] text-black' : 'bg-gray-600 text-white'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.featured ? <span className="text-[var(--color-brand-primary)]">★</span> : <span className="text-gray-600">☆</span>}
                                </td>
                                <td className="p-4">{item.order}</td>
                                <td className="p-4 text-right flex justify-end gap-3 flex-wrap">
                                    <button onClick={() => handleToggleStatus(item.id, item.status)} className="text-xs font-bold hover:text-[var(--color-brand-primary)] uppercase underline underline-offset-4">Toggle</button>
                                    <button onClick={() => navigate(`/admin/projects/${item.id}/edit`)} className="text-xs font-bold hover:text-[var(--color-brand-tertiary)] uppercase underline underline-offset-4">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-[var(--color-brand-error)] hover:text-red-400 uppercase underline underline-offset-4">Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Card>
    );
}
