import React from 'react';
import { motion } from 'framer-motion';

const galleryImages = [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1442512595367-4273250913a9?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507133750069-4595258a7439?auto=format&fit=crop&q=80',
];

const Gallery = () => {
    return (
        <section id="gallery" className="py-32 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-6xl text-primary mb-4 font-bold">Galeri Kami</h2>
                    <p className="text-muted-foreground text-lg">Corners of aesthetic pleasure.</p>
                </motion.div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {galleryImages.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer"
                        >
                            <img src={src} alt={`Gallery ${index + 1}`} className="w-full block rounded-2xl transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <span className="text-white px-8 py-3 border border-white rounded-full uppercase tracking-widest text-sm">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
