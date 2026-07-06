import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Loader2, RefreshCw, X, Edit2, Save, Plus, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { settingsApi, uploadApi } from '../../services/api';

const SpaceImagesManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null);
    const [error, setError] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const fileInputRefs = useRef({});

    const fetchImages = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await settingsApi.getSpaceImages();
            setImages(Array.isArray(data.images) ? data.images : []);
        } catch (err) {
            console.error('Error fetching space images:', err);
            setError('Failed to load space images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleSaveAll = async () => {
        try {
            setSaving(true);
            await settingsApi.updateSpaceImages(images);
            alert('Space images saved successfully!');
        } catch (err) {
            console.error('Error saving:', err);
            alert('Failed to save images');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (index, files) => {
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
            setUploading(index);
            const result = await uploadApi.upload(file);

            const newImages = [...images];
            newImages[index] = { ...newImages[index], src: result.url };
            setImages(newImages);
        } catch (err) {
            console.error('Upload error:', err);
            alert(err.message || 'Failed to upload image');
        } finally {
            setUploading(null);
        }
    };

    const handleUpdateField = (index, field, value) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], [field]: value };
        setImages(newImages);
    };

    const handleAddImage = () => {
        setImages([...images, { src: '', title: 'New Image', caption: 'Add a caption' }]);
    };

    const handleDeleteImage = (index) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        setImages(images.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
                    <p className="text-muted-foreground">Loading space images...</p>
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
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2">Space Images</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Manage "Our Space" section images on homepage.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchImages} disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <Button className="bg-[#3E2723] hover:bg-[#2D2420]" onClick={handleSaveAll} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((image, index) => (
                    <Card key={index} className="border-none shadow-sm overflow-hidden">
                        <div className="relative aspect-[4/3] bg-gray-100">
                            {image.src ? (
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}

                            {}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                                <input
                                    ref={(el) => fileInputRefs.current[index] = el}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(index, e.target.files)}
                                />
                                <Button
                                    size="sm"
                                    className="bg-white text-[#3E2723] hover:bg-gray-100"
                                    onClick={() => fileInputRefs.current[index]?.click()}
                                    disabled={uploading === index}
                                >
                                    {uploading === index ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-[#5D4037] mb-1">Title</label>
                                <input
                                    type="text"
                                    value={image.title || ''}
                                    onChange={(e) => handleUpdateField(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    placeholder="Image title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#5D4037] mb-1">Caption</label>
                                <input
                                    type="text"
                                    value={image.caption || ''}
                                    onChange={(e) => handleUpdateField(index, 'caption', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    placeholder="Short caption"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {}
                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-[#8D6E63] transition-colors cursor-pointer"
                    onClick={handleAddImage}
                >
                    <div className="aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground hover:text-[#8D6E63] transition-colors">
                        <Plus size={40} className="mb-2" />
                        <span className="font-medium">Add Image</span>
                    </div>
                </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p>💡 Tip: The first image will be displayed larger. Recommended: 3 images for best layout.</p>
            </div>
        </div>
    );
};

export default SpaceImagesManagement;
