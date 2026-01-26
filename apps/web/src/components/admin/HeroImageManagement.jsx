import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { settingsApi, uploadApi } from '../../services/api';
import { Card, CardContent } from '../ui/card';

const HeroImageManagement = () => {
    const [heroImage, setHeroImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchHeroImage();
    }, []);

    const fetchHeroImage = async () => {
        try {
            setLoading(true);
            const data = await settingsApi.getHeroImage();
            if (data && data.heroImage) {
                setHeroImage(data.heroImage);
            }
        } catch (err) {
            setError('Failed to load hero image');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            // Upload to Cloudinary
            const uploadResult = await uploadApi.upload(file);

            if (uploadResult && uploadResult.url) {
                // Save to settings
                setSaving(true);
                await settingsApi.updateHeroImage(uploadResult.url);
                setHeroImage(uploadResult.url);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('Failed to upload image: ' + err.message);
        } finally {
            setUploading(false);
            setSaving(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Yakin ingin menghapus dan menggunakan gambar default?')) return;

        try {
            setSaving(true);
            // Reset to default image
            const defaultImage = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80';
            await settingsApi.updateHeroImage(defaultImage);
            setHeroImage(defaultImage);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to reset image');
        } finally {
            setSaving(false);
        }
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
                <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Hero Image</h1>
                <p className="text-muted-foreground">Upload gambar untuk background hero section di halaman utama.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2"
                >
                    <CheckCircle size={18} /> Gambar berhasil diperbarui!
                </motion.div>
            )}

            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Preview */}
                        <div>
                            <h3 className="font-medium mb-3 text-foreground">Preview</h3>
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                {heroImage ? (
                                    <img
                                        src={heroImage}
                                        alt="Hero Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <Image size={48} className="opacity-30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white font-['Baskervville'] text-4xl">ruang kopi</span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Controls */}
                        <div className="flex flex-col justify-center">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2 text-foreground">Upload Gambar Baru</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Rekomendasi: Resolusi minimal 1920x1080px, format JPG/PNG, ukuran maksimal 5MB.
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading || saving}
                                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-muted-foreground hover:border-[#8D6E63] hover:text-[#8D6E63] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Mengupload...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Pilih Gambar
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleRemoveImage}
                                    disabled={saving}
                                    className="w-full py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Trash2 size={16} />
                                    Reset ke Gambar Default
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Current URL */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">URL Gambar Saat Ini:</p>
                    <p className="text-sm text-foreground break-all font-mono bg-gray-50 p-2 rounded">{heroImage}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default HeroImageManagement;
