import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Eye, CheckCircle, Clock, Trash2, Loader2, MessageSquare, Search } from 'lucide-react';
import { ideasApi } from '../../services/api';
import { Card, CardContent } from '../ui/card';

const IdeasManagement = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { id: 'Baru', label: 'Baru', color: 'bg-blue-100 text-blue-700', icon: Clock },
        { id: 'Dibaca', label: 'Dibaca', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
        { id: 'Diproses', label: 'Diproses', color: 'bg-purple-100 text-purple-700', icon: Loader2 },
        { id: 'Selesai', label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    ];

    const topicColors = {
        'Soal Rasa': 'bg-orange-100 text-orange-700',
        'Suasana Ruang': 'bg-teal-100 text-teal-700',
        'Pelayanan': 'bg-pink-100 text-pink-700',
        'Ide Baru': 'bg-indigo-100 text-indigo-700',
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const data = await ideasApi.getAll();
            setIdeas(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await ideasApi.updateStatus(id, newStatus);
            setIdeas(prev => prev.map(idea =>
                idea.id === id ? { ...idea, status: newStatus } : idea
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus gagasan ini?')) return;
        try {
            await ideasApi.delete(id);
            setIdeas(prev => prev.filter(idea => idea.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const filteredIdeas = ideas.filter(idea => {
        const matchesFilter = filter === 'all' || idea.status === filter;
        const matchesSearch = idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: ideas.length,
        baru: ideas.filter(i => i.status === 'Baru').length,
        diproses: ideas.filter(i => i.status === 'Diproses').length,
        selesai: ideas.filter(i => i.status === 'Selesai').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Kotak Gagasan</h1>
                <p className="text-muted-foreground">Kelola masukan dan ide dari pelanggan.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.baru}</p>
                            <p className="text-xs text-muted-foreground">Baru</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <Loader2 size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.diproses}</p>
                            <p className="text-xs text-muted-foreground">Diproses</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.selesai}</p>
                            <p className="text-xs text-muted-foreground">Selesai</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari gagasan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Semua
                    </button>
                    {statusOptions.map(status => (
                        <button
                            key={status.id}
                            onClick={() => setFilter(status.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ideas List */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
            )}

            {filteredIdeas.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Lightbulb size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Belum ada gagasan yang masuk.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredIdeas.map((idea) => (
                            <motion.div
                                key={idea.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${topicColors[idea.topic] || 'bg-gray-100'}`}>
                                                        {idea.topic}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusOptions.find(s => s.id === idea.status)?.color || 'bg-gray-100'}`}>
                                                        {idea.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-foreground mb-1">{idea.name}</h3>
                                                {idea.contact && (
                                                    <p className="text-sm text-muted-foreground mb-2">{idea.contact}</p>
                                                )}
                                                <p className="text-sm text-foreground/80 leading-relaxed">{idea.message}</p>
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    {new Date(idea.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex md:flex-col gap-2">
                                                <select
                                                    value={idea.status}
                                                    onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                                                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status.id} value={status.id}>{status.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(idea.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default IdeasManagement;
