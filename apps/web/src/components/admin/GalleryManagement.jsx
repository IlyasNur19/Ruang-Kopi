import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Loader2, RefreshCw, X, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { galleryApi, uploadApi } from '../../services/api';

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Modal state for adding new image
    const [showModal, setShowModal] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [category, setCategory] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchImages = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await galleryApi.getAll();
            setImages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileSelect = async (files) => {
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
            setError(null);


            const result = await uploadApi.upload(file);


            setUploadedUrl(result.url);
            setCategory('');
            setShowModal(true);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveImage = async (e) => {
        e.preventDefault();

        if (!uploadedUrl || !category) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setSaving(true);


            await galleryApi.create({
                src: uploadedUrl,
                category: category,
            });

            setShowModal(false);
            setUploadedUrl('');
            setCategory('');
            fetchImages();
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save image');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (image) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            setDeleting(image.id);

            // Delete from database
            await galleryApi.delete(image.id);

            // Update local state
            setImages(images.filter(img => img.id !== image.id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete image');
        } finally {
            setDeleting(null);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
                    <p className="text-muted-foreground">Loading gallery...</p>
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
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2">Gallery Management</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Upload and manage your cafe photos.</p>
                </div>
                <Button variant="outline" onClick={fetchImages} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </Button>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Upload Area */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Upload New Photo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${dragActive ? 'border-[#8D6E63] bg-[#FBEFEF]' : 'border-gray-200 hover:border-[#8D6E63] hover:bg-[#FBEFEF]'}
                            ${uploading ? 'pointer-events-none opacity-70' : ''}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                        {uploading ? (
                            <>
                                <Loader2 size={40} className="text-[#8D6E63] mx-auto mb-4 animate-spin" />
                                <p className="font-medium text-foreground mb-1">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload size={40} className="text-muted-foreground mx-auto mb-4 group-hover:text-[#8D6E63] transition-colors" />
                                <p className="font-medium text-foreground mb-1">Click to upload or drag photos here</p>
                                <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence>
                    {images.map((image) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative rounded-xl overflow-hidden aspect-square shadow-sm group"
                        >
                            <img
                                src={image.src}
                                alt={image.category}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                        {image.category}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={() => handleDelete(image)}
                                disabled={deleting === image.id}
                            >
                                {deleting === image.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No images in gallery. Upload your first image!
                </div>
            )}

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-[#3E2723]">Add Image Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveImage} className="p-6 space-y-4">
                            {/* Preview */}
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={uploadedUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-[#D7CCC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                    placeholder="e.g., Coffee, Interior, Food"
                                />
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
                                        'Save Image'
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

export default GalleryManagement;
