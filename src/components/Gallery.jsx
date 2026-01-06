import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Gallery.css';

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
        <section id="gallery" className="gallery-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="gallery-header"
                >
                    <h2 className="gallery-title">Galeri Kami</h2>
                    <p className="gallery-subtitle">Corners of aesthetic pleasure.</p>
                </motion.div>

                <div className="masonry-grid">
                    {galleryImages.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="gallery-item-wrapper"
                        >
                            <img src={src} alt={`Gallery ${index + 1}`} className="gallery-img" />
                            <div className="gallery-overlay">
                                <span>View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
