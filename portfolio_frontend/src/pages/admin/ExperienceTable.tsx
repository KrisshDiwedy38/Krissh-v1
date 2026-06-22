import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Card from '../../components/ui/Card';

export default function ExperienceTable() {
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const res = await api.get('/admin/experience/');
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
            await api.patch(`/admin/experience/${id}/status/`, { status: newStatus });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
        try {
            await api.delete(`/admin/experience/${id}/`);
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
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Company</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Role</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase hidden md:table-cell">Duration</th>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase">Type</th>
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
                                <td className="p-4 font-bold">{item.company}</td>
                                <td className="p-4 opacity-80">{item.role}</td>
                                <td className="p-4 hidden md:table-cell text-xs opacity-70">
                                    {item.start_date} — {item.end_date || 'Present'}
                                </td>
                                <td className="p-4">
                                    <span className="inline-block border-[1px] border-[var(--color-brand-border-muted)] px-2 py-1 text-[10px] uppercase">
                                        {item.employment_type?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4">{item.order}</td>
                                <td className="p-4 text-right flex justify-end gap-3 flex-wrap">
                                    <button onClick={() => handleToggleStatus(item.id, item.status)} className={`text-xs font-bold uppercase underline underline-offset-4 ${item.status === 'PUBLISHED' ? 'text-[#44ff44]' : 'text-gray-500'}`}>Toggle</button>
                                    <button onClick={() => navigate(`/admin/experience/${item.id}/edit`)} className="text-xs font-bold hover:text-[var(--color-brand-tertiary)] uppercase underline underline-offset-4">Edit</button>
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
