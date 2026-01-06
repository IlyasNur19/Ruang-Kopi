import React from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Trash2 } from 'lucide-react';

const GalleryManagement = () => {
    // Mock data for gallery
    const galleryImages = [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1442512595367-4273250913a9?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80',
    ];

    return (
        <div className="gallery-management">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="content-header"
            >
                <h1>Gallery Management</h1>
                <p>Upload and manage your cafe photos.</p>
            </motion.div>

            <section className="dashboard-card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h3>Upload New Photo</h3>
                </div>
                <div className="upload-area">
                    <Upload size={40} className="text-gray" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                    <p>Click to upload or drag photos here</p>
                    <span className="text-small">JPG, PNG up to 5MB</span>
                </div>
            </section>

            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {galleryImages.map((src, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="gallery-item-admin"
                        style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    >
                        <img src={src} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(239, 83, 80, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManagement;
