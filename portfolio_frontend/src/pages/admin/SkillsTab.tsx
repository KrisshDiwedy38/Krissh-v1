import { useState, useEffect } from 'react';
import api from '../../api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface Skill {
    id: number;
    name: string;
    order: number;
}

interface SkillCategory {
    id: number;
    title: string;
    subtitle: string;
    order: number;
    skills: Skill[];
}

export default function SkillsTab() {
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');

    const fetchSkills = async () => {
        try {
            const res = await api.get('/admin/skills/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryTitle) return;
        try {
            await api.post('/admin/skills/categories/', { title: newCategoryTitle, order: categories.length });
            setNewCategoryTitle('');
            fetchSkills();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Delete this category and all its skills?')) return;
        try {
            await api.delete(`/admin/skills/categories/${id}/`);
            fetchSkills();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateCategory = async (id: number, field: string, value: string) => {
        try {
            await api.patch(`/admin/skills/categories/${id}/`, { [field]: value });
            fetchSkills();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSkill = async (categoryId: number, skillName: string) => {
        if (!skillName.trim()) return;
        const cat = categories.find(c => c.id === categoryId);
        try {
            await api.post('/admin/skills/items/', {
                category: categoryId,
                name: skillName,
                order: cat?.skills.length || 0
            });
            fetchSkills();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteSkill = async (skillId: number) => {
        try {
            await api.delete(`/admin/skills/items/${skillId}/`);
            fetchSkills();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
            <Card className="bg-[var(--color-brand-surface-2)] !p-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex flex-col gap-2 flex-grow w-full">
                    <label className="font-bold text-sm uppercase tracking-widest">New Category Name</label>
                    <span className="text-xs text-gray-400">Add a new collapsible category (e.g., "Frontend").</span>
                    <input 
                        type="text" 
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-2 font-sans w-full"
                        placeholder="New Category..."
                    />
                </div>
                <Button onClick={handleAddCategory} variant="primary" className="whitespace-nowrap">ADD CATEGORY</Button>
            </Card>

            {categories.map((category) => (
                <Card key={category.id} className="bg-[var(--color-brand-surface-2)] !p-6 relative">
                    <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm uppercase font-bold underline"
                    >
                        Delete Category
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex flex-col gap-2 w-full md:w-1/2">
                            <label className="font-bold text-sm uppercase tracking-widest">Category Title</label>
                            <input 
                                type="text"
                                value={category.title}
                                onBlur={(e) => handleUpdateCategory(category.id, 'title', e.target.value)}
                                onChange={(e) => {
                                    const newCats = [...categories];
                                    const idx = newCats.findIndex(c => c.id === category.id);
                                    newCats[idx].title = e.target.value;
                                    setCategories(newCats);
                                }}
                                className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-2 font-sans"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-1/2">
                            <label className="font-bold text-sm uppercase tracking-widest">Subtitle</label>
                            <input 
                                type="text"
                                value={category.subtitle}
                                onBlur={(e) => handleUpdateCategory(category.id, 'subtitle', e.target.value)}
                                onChange={(e) => {
                                    const newCats = [...categories];
                                    const idx = newCats.findIndex(c => c.id === category.id);
                                    newCats[idx].subtitle = e.target.value;
                                    setCategories(newCats);
                                }}
                                className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-2 font-sans"
                                placeholder="Optional subtitle"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase tracking-widest">Skills</label>
                        <span className="text-xs text-gray-400">Add or remove skills in this category.</span>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {category.skills.map(skill => (
                                <div key={skill.id} className="flex items-center gap-2 bg-[var(--color-brand-surface-3)] px-3 py-1 border-[2px] border-[var(--color-brand-border)]">
                                    <span className="font-sans text-sm">{skill.name}</span>
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-[var(--color-brand-error)] hover:text-red-400 font-bold ml-2">×</button>
                                </div>
                            ))}
                        </div>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem('newSkill') as HTMLInputElement;
                                handleAddSkill(category.id, input.value);
                                input.value = '';
                            }}
                            className="flex gap-2"
                        >
                            <input 
                                name="newSkill"
                                type="text" 
                                placeholder="Add skill (press Enter)..." 
                                className="bg-[var(--color-brand-surface-1)] border-[2px] border-[var(--color-brand-border-muted)] p-2 font-sans text-sm flex-grow max-w-xs"
                            />
                            <Button type="submit" variant="secondary" className="!py-1 !px-3 !text-xs">ADD</Button>
                        </form>
                    </div>
                </Card>
            ))}
        </div>
    );
}
