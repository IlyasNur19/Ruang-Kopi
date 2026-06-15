import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { mejaApi } from '../../services/api';
import { TABLE_STATUS } from '../../stores/tableStore';
import { getLocalTables, saveLocalTables, fetchTablesWithFallback } from '../../lib/tableData';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingLocal, setUsingLocal] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ nomor_meja: '', kapasitas: 4, status: 'tersedia' });
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchTables = async () => {
        setLoading(true);
        setError(null);
        const result = await fetchTablesWithFallback(mejaApi.getAll);
        setTables(result.tables);
        setUsingLocal(result.usingLocal);
        setLoading(false);
    };

    useEffect(() => { fetchTables(); }, []);

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ nomor_meja: '', kapasitas: 4, status: 'tersedia' });
        setDialogOpen(true);
    };

    const handleOpenEdit = (table) => {
        setEditingId(table.id);
        setFormData({
            nomor_meja: table.nomor_meja || table.nomorMeja || '',
            kapasitas: table.kapasitas || 4,
            status: table.status || 'tersedia',
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.nomor_meja.trim()) return;
        try {
            setSaving(true);

            if (usingLocal) {
                // Gunakan localStorage
                let updated;
                if (editingId) {
                    updated = tables.map((t) =>
                        t.id === editingId ? { ...t, ...formData } : t
                    );
                } else {
                    const newTable = {
                        id: Date.now().toString(),
                        ...formData,
                    };
                    updated = [...tables, newTable];
                }
                setTables(updated);
                saveLocalTables(updated);
            } else {
                // Gunakan API
                if (editingId) {
                    await mejaApi.update(editingId, formData);
                } else {
                    await mejaApi.create(formData);
                }
                await fetchTables();
            }

            setDialogOpen(false);
        } catch (err) {
            console.error('Failed to save table:', err);
            alert('Gagal menyimpan meja.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (usingLocal) {
                const updated = tables.filter((t) => t.id !== id);
                setTables(updated);
                saveLocalTables(updated);
            } else {
                await mejaApi.delete(id);
                await fetchTables();
            }
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete table:', err);
            alert('Gagal menghapus meja.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-[#8D6E63]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                    <p className="text-red-600 text-sm flex-1">{error}</p>
                    <Button onClick={fetchTables} variant="outline" size="sm" className="gap-1.5 shrink-0">
                        <RefreshCw size={14} /> Coba Lagi
                    </Button>
                </div>
            )}

            {usingLocal && !error && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm text-amber-700">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    Menggunakan data lokal. Data akan disinkronkan saat backend tersedia.
                </div>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-[#3E2723]">Manajemen Meja</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Kelola data meja untuk reservasi dan POS
                        </p>
                    </div>
                    <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 bg-[#3E2723] hover:bg-[#4E342E]">
                        <Plus size={16} /> Tambah Meja
                    </Button>
                </CardHeader>
                <CardContent>
                    {tables.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-[64px] text-[#3E2723]/10">table_restaurant</span>
                            <p className="text-[#6D4C41] font-medium mt-4">Belum ada meja</p>
                            <p className="text-[#6D4C41]/60 text-sm mt-1 mb-4">Tambahkan meja pertama untuk memulai.</p>
                            <Button onClick={handleOpenAdd} variant="outline" className="gap-1.5">
                                <Plus size={16} /> Tambah Meja
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Meja</TableHead>
                                    <TableHead>Kapasitas</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tables.map((table) => {
                                    const status = TABLE_STATUS[table.status] || TABLE_STATUS.tersedia;
                                    return (
                                        <TableRow key={table.id}>
                                            <TableCell className="font-semibold text-[#3E2723]">
                                                Meja {table.nomor_meja || table.nomorMeja}
                                            </TableCell>
                                            <TableCell>{table.kapasitas || 4} Orang</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1.5"
                                                    style={{
                                                        borderColor: status.borderColor,
                                                        backgroundColor: status.bgColor,
                                                        color: status.textColor,
                                                    }}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(table)}>
                                                        <Edit size={14} className="text-[#6D4C41]" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(table.id)}>
                                                        <Trash2 size={14} className="text-red-400" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Meja' : 'Tambah Meja Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingId ? 'Ubah detail meja.' : 'Tambahkan meja baru ke sistem.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="nomor_meja">Nomor Meja</Label>
                            <Input
                                id="nomor_meja"
                                value={formData.nomor_meja}
                                onChange={(e) => setFormData({ ...formData, nomor_meja: e.target.value })}
                                placeholder="Contoh: 7"
                                className="mt-1.5"
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label htmlFor="kapasitas">Kapasitas (Orang)</Label>
                            <select
                                id="kapasitas"
                                value={formData.kapasitas}
                                onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) })}
                                className="w-full mt-1.5 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                                    <option key={n} value={n}>{n} Orang</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full mt-1.5 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {Object.entries(TABLE_STATUS).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !formData.nomor_meja.trim()}
                            className="bg-[#3E2723] hover:bg-[#4E342E]"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                            {editingId ? 'Simpan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Meja?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Meja akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
                        <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TableManagement;
