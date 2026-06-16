import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, RefreshCw, X, Upload, Image } from 'lucide-react';
import { menuApi, categoriesApi, uploadApi } from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        available: true,
        image: '',
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [menuData, categoriesData] = await Promise.all([
                menuApi.getAll(),
                categoriesApi.getAll(),
            ]);

            setMenuItems(Array.isArray(menuData) ? menuData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError('Failed to load menu items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            setDeleting(id);
            await menuApi.delete(id);
            setMenuItems(menuItems.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            categoryId: categories[0]?.id || '',
            available: true,
            image: '',
        });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price?.toString() || '',
            categoryId: item.categoryId || '',
            available: item.available,
            image: item.image || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate price before sending
        const priceValue = parseInt(formData.price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert('Harga harus berupa angka positif. Contoh: 35000');
            return;
        }

        try {
            setSaving(true);

            // Build data object — only include valid fields to avoid Zod validation errors
            const data = {
                name: formData.name,
                price: priceValue,
                available: formData.available,
            };

            // description: only include if non-empty
            if (formData.description && formData.description.trim() !== '') {
                data.description = formData.description.trim();
            }

            // categoryId: only include if it's a valid number
            const catId = parseInt(formData.categoryId);
            if (!isNaN(catId)) {
                data.categoryId = catId;
            }

            // image: only include if it's a non-empty URL string
            if (formData.image && formData.image.trim() !== '') {
                data.image = formData.image.trim();
            } else if (editingItem) {
                // When clearing an existing image, explicitly set to null
                data.image = null;
            }

            if (editingItem) {
                await menuApi.update(editingItem.id, data);
            } else {
                // Create must include all required fields
                if (!data.name) throw new Error('Name is required');
                if (!data.categoryId) throw new Error('Category is required');
                await menuApi.create(data);
            }

            setShowModal(false);
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Error saving item:', err);
            alert('Gagal menyimpan: ' + (err.message || 'Silakan coba lagi.'));
        } finally {
            setSaving(false);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Unknown';
    };

    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            const result = await uploadApi.upload(file);
            setFormData({ ...formData, image: result.url });
        } catch (err) {
            console.error('Upload error:', err);
            alert(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
                    <p className="text-muted-foreground">Loading menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
                <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2">Menu Management</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Manage your food and beverages.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <Button className="bg-[#3E2723] hover:bg-[#2D2420]" onClick={openAddModal}>
                        <Plus size={18} className="mr-2" />
                        <span className="hidden sm:inline">Add New Item</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>NAME</TableHead>
                                    <TableHead>CATEGORY</TableHead>
                                    <TableHead>PRICE</TableHead>
                                    <TableHead>STATUS</TableHead>
                                    <TableHead className="text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menuItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">#{item.id}</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-[#3E2723]">{item.name}</span>
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    {item.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-[#EFEBE9] text-[#5D4037] hover:bg-[#D7CCC8]">
                                                {getCategoryName(item.categoryId)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>Rp {parseInt(item.price).toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.available ? "default" : "destructive"}
                                                className={item.available ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                                            >
                                                {item.available ? 'Active' : 'Out of Stock'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                >
                                                    {deleting === item.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {menuItems.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No menu items found. Add your first item!
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-[#3E2723]">
                                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    placeholder="e.g., Signature Latte"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    placeholder="Describe your menu item..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                        Price (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                        placeholder="35000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                    Image
                                </label>

                                {/* Image Preview */}
                                {formData.image && (
                                    <div className="mb-3 relative">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Upload Area */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
                                        ${uploading ? 'pointer-events-none opacity-70' : 'hover:border-[#8D6E63] hover:bg-[#FBEFEF]'}
                                        ${formData.image ? 'border-gray-200' : 'border-[#D7CCC8]'}
                                    `}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                    />
                                    {uploading ? (
                                        <div className="flex items-center justify-center gap-2 py-2">
                                            <Loader2 size={20} className="animate-spin text-[#8D6E63]" />
                                            <span className="text-sm text-muted-foreground">Uploading...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 py-2">
                                            <Upload size={20} className="text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {formData.image ? 'Change image' : 'Upload image'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                    className="w-4 h-4 text-[#3E2723] border-[#D7CCC8] rounded focus:ring-[#8D6E63]"
                                />
                                <label htmlFor="available" className="text-sm text-[#5D4037]">
                                    Available for order
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#3E2723] hover:bg-[#2D2420]"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingItem ? 'Update Item' : 'Add Item'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
