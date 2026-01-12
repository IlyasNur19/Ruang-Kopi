import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Gallery Management</h1>
                <p className="text-muted-foreground">Upload and manage your cafe photos.</p>
            </motion.div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Upload New Photo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#8D6E63] hover:bg-[#FBEFEF] transition-all group">
                        <Upload size={40} className="text-muted-foreground mx-auto mb-4 group-hover:text-[#8D6E63] transition-colors" />
                        <p className="font-medium text-foreground mb-1">Click to upload or drag photos here</p>
                        <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryImages.map((src, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative rounded-xl overflow-hidden aspect-square shadow-sm group"
                    >
                        <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManagement;
