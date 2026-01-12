import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80', category: 'Coffee', span: 'row-span-2' },
    { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80', category: 'Latte Art' },
    { src: 'https://images.unsplash.com/photo-1442512595367-4273250913a9?auto=format&fit=crop&q=80', category: 'Interior' },
    { src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80', category: 'Atmosphere', span: 'col-span-2' },
    { src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80', category: 'Interior' },
    { src: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd9b?auto=format&fit=crop&q=80', category: 'Cold Brew' },
    { src: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80', category: 'Manual Brew', span: 'row-span-2' },
    { src: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80', category: 'Cappuccino' },
    { src: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&q=80', category: 'Matcha' },
];

const GalleryPage = () => {
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

                    {/* Masonry Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[200px]">
                        {galleryImages.map((img, index) => (
                            <motion.div
                                key={index}
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
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GalleryPage;
