import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Eye, CheckCircle, Clock, Trash2, Loader2, MessageSquare, Search, X, User, Phone, Tag, FileText, ChevronDown, Filter } from 'lucide-react';
import { ideasApi } from '../../services/api';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const IdeasManagement = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [topicFilter, setTopicFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedIdea, setSelectedIdea] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const statusOptions = [
        { id: 'Baru', label: 'Baru', color: 'bg-blue-100 text-blue-700', icon: Clock },
        { id: 'Dibaca', label: 'Dibaca', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
        { id: 'Diproses', label: 'Diproses', color: 'bg-purple-100 text-purple-700', icon: Loader2 },
        { id: 'Selesai', label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    ];

    const topicOptions = [
        { id: 'all', label: 'Semua Topik' },
        { id: 'Soal Rasa', label: 'Soal Rasa' },
        { id: 'Suasana Ruang', label: 'Suasana Ruang' },
        { id: 'Pelayanan', label: 'Pelayanan' },
        { id: 'Ide Baru', label: 'Ide Baru' },
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
            setUpdatingStatus(true);
            await ideasApi.updateStatus(id, newStatus);
            setIdeas(prev => prev.map(idea =>
                idea.id === id ? { ...idea, status: newStatus } : idea
            ));

            if (selectedIdea?.id === id) {
                setSelectedIdea(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus gagasan ini?')) return;
        try {
            await ideasApi.delete(id);
            setIdeas(prev => prev.filter(idea => idea.id !== id));
            if (selectedIdea?.id === id) {
                closeDetailModal();
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const openDetailModal = (idea) => {
        setSelectedIdea(idea);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedIdea(null);
    };

    const filteredIdeas = ideas.filter(idea => {
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        const matchesTopic = topicFilter === 'all' || idea.topic === topicFilter;
        const matchesSearch = idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesTopic && matchesSearch;
    });

    const stats = {
        total: ideas.length,
        baru: ideas.filter(i => i.status === 'Baru').length,
        diproses: ideas.filter(i => i.status === 'Diproses').length,
        selesai: ideas.filter(i => i.status === 'Selesai').length,
    };

    const DetailModal = () => {
        if (!selectedIdea) return null;

        const idea = selectedIdea;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={closeDetailModal}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {}
                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                        <h3 className="font-heading text-xl font-bold text-[#3E2723]">Detail Feedback</h3>
                        <button
                            onClick={closeDetailModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {}
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${topicColors[idea.topic] || 'bg-gray-100'}`}>
                                {idea.topic}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusOptions.find(s => s.id === idea.status)?.color || 'bg-gray-100'}`}>
                                {idea.status}
                            </span>
                        </div>

                        {}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <User size={20} className="text-[#3E2723] mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Nama</p>
                                    <p className="font-medium text-[#3E2723]">{idea.name}</p>
                                </div>
                            </div>

                            {idea.contact && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Phone size={20} className="text-[#3E2723] mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Kontak</p>
                                        <p className="font-medium text-[#3E2723]">{idea.contact}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <Tag size={20} className="text-[#3E2723] mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Topik</p>
                                    <p className="font-medium text-[#3E2723]">{idea.topic}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <FileText size={20} className="text-[#3E2723] mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground mb-1">Pesan</p>
                                    <p className="text-[#3E2723] leading-relaxed">{idea.message}</p>
                                </div>
                            </div>
                        </div>

                        {}
                        <p className="text-sm text-muted-foreground text-center">
                            Dikirim pada {new Date(idea.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>

                        {}
                        <div>
                            <p className="text-sm font-medium text-[#3E2723] mb-3">Update Status</p>
                            <div className="grid grid-cols-2 gap-2">
                                {statusOptions.map(status => (
                                    <button
                                        key={status.id}
                                        onClick={() => handleStatusChange(idea.id, status.id)}
                                        disabled={updatingStatus || idea.status === status.id}
                                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                                            ${idea.status === status.id
                                                ? 'bg-[#3E2723] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }
                                            ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {updatingStatus && idea.status !== status.id ? null : (
                                            idea.status === status.id ? <CheckCircle size={16} /> : null
                                        )}
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleDelete(idea.id)}
                            >
                                <Trash2 size={18} className="mr-2" />
                                Hapus
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={closeDetailModal}>
                                Tutup
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
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

            {}
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

            {}
            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-[#3E2723]">Filter:</span>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {}
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

                    {}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Topik:</span>
                        <div className="relative">
                            <select
                                value={topicFilter}
                                onChange={(e) => setTopicFilter(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20"
                            >
                                {topicOptions.map(topic => (
                                    <option key={topic.id} value={topic.id}>{topic.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20"
                            >
                                <option value="all">Semua Status</option>
                                {statusOptions.map(status => (
                                    <option key={status.id} value={status.id}>{status.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                {}
                <p className="text-sm text-muted-foreground">
                    Menampilkan {filteredIdeas.length} dari {ideas.length} gagasan
                </p>
            </div>

            {}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
            )}

            {filteredIdeas.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Lightbulb size={48} className="mx-auto mb-4 opacity-30" />
                    <p>{ideas.length === 0 ? 'Belum ada gagasan yang masuk.' : 'Tidak ada gagasan yang cocok dengan filter.'}</p>
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
                                <Card
                                    className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => openDetailModal(idea)}
                                >
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
                                                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">{idea.message}</p>
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    {new Date(idea.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <span className="text-xs mr-2">Klik untuk detail</span>
                                                <Eye size={18} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {}
            <AnimatePresence>
                {showDetailModal && <DetailModal />}
            </AnimatePresence>
        </div>
    );
};

export default IdeasManagement;
