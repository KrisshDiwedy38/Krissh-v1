import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Card from '../../components/ui/Card';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

export default function ProjectsTable() {
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const res = await api.get('/admin/projects/');
            setItems(res.data);
        } catch (err) {
            // error silenced
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);



    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/admin/projects/${id}/`);
            fetchItems();
        } catch (err) {
            // error silenced
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (dragIndex === dropIndex) return;

        const newItems = [...items];
        const [draggedItem] = newItems.splice(dragIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);
        
        // Update local state for immediate feedback
        setItems(newItems);

        // Batch update orders sequentially
        for (let i = 0; i < newItems.length; i++) {
            if (newItems[i].order !== i) {
                try {
                    await api.patch(`/admin/projects/${newItems[i].id}/`, { order: i });
                } catch (err) {
                    // error silenced
                }
            }
        }
        fetchItems(); // Refetch to ensure sync
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <Card className="w-full !p-0">
            <div className="w-full overflow-x-auto pb-2">
                <table className="w-full text-left font-sans whitespace-nowrap min-w-[600px]">
                <thead className="bg-[var(--color-brand-surface-2)] border-b-[3px] border-[var(--color-brand-border)]">
                    <tr>
                        <th className="p-4 font-bold text-sm tracking-widest uppercase w-12 text-center">Drag</th>
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
                            <td colSpan={7} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No entries found.</td>
                        </tr>
                    ) : (
                        items.map((item, i) => (
                            <tr 
                                key={item.id} 
                                className={i !== items.length - 1 ? "border-b-[2px] border-[var(--color-brand-border-muted)]" : ""}
                                draggable
                                onDragStart={(e) => handleDragStart(e, i)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, i)}
                            >
                                <td className="p-4 text-center cursor-move text-gray-500 hover:text-white">
                                    <GripVertical size={16} />
                                </td>
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
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-4">
                                        <button onClick={() => navigate(`/admin/projects/${item.id}/edit`)} className="text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors" aria-label="Edit">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-[var(--color-brand-error)] hover:text-red-400 transition-colors" aria-label="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </div>
        </Card>
    );
}
