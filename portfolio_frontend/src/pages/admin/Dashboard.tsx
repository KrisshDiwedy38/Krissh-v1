import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        <div className="min-h-screen bg-[#0f0f1a] text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/')} 
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            View Site
                        </button>
                        <button 
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Projects
                    </button>
                    <button 
                        onClick={() => setActiveTab('experience')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'experience' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Experience
                    </button>
                    <button 
                        onClick={() => navigate(`/admin/${activeTab}/new`)}
                        className="ml-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                        + New {activeTab === 'projects' ? 'Project' : 'Experience'}
                    </button>
                </div>

                <div className="bg-[#161625] rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900 border-b border-gray-800">
                            <tr>
                                <th className="p-4 font-medium text-gray-400">Title / Role</th>
                                <th className="p-4 font-medium text-gray-400">Status</th>
                                <th className="p-4 font-medium text-gray-400">Order</th>
                                <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No items found.</td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                        <td className="p-4 font-medium text-gray-200">
                                            {activeTab === 'projects' ? item.title : `${item.role} @ ${item.company}`}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{item.order}</td>
                                        <td className="p-4 text-right flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleToggleStatus(item.id, item.status)}
                                                className="text-sm text-gray-400 hover:text-white"
                                            >
                                                Toggle Status
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/admin/${activeTab}/${item.id}/edit`)}
                                                className="text-sm text-indigo-400 hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-sm text-red-400 hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
