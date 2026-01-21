import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { galleryApi } from '../services/api';
import { useApi } from '../hooks/useApi';

const GalleryPage = () => {
    // Fetch gallery images from API
    const { data: galleryImages, loading, error, refetch } = useApi(galleryApi.getAll);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EFEBE9] rounded-full mb-6 text-primary">
                            <Camera size={28} />
                        </div>
                        <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4 font-bold">Galeri Kami</h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Momen-momen hangat yang tercipta di RuangKopi. Setiap sudut menyimpan cerita.
                        </p>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground">Memuat galeri...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat galeri: {error}</p>
                            <button
                                onClick={refetch}
                                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Masonry Grid */}
                    {!loading && !error && galleryImages && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[200px]">
                            {galleryImages.map((img, index) => (
                                <motion.div
                                    key={img.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative rounded-2xl overflow-hidden group cursor-pointer ${img.span || ''}`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.category}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="text-white font-medium text-sm uppercase tracking-wider px-4 py-2 border border-white/50 rounded-full backdrop-blur-sm">
                                            {img.category}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && galleryImages && galleryImages.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Belum ada gambar di galeri.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GalleryPage;
