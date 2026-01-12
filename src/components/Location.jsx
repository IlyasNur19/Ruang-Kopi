import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

const Location = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const hours = new Date().getHours();
            // Buka pukul 08:00 - 22:00
            setIsOpen(hours >= 8 && hours < 22);
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="location" className="py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-5xl text-primary mb-6 font-bold">Kunjungi Kami</h2>
                        <p className="text-muted-foreground mb-12 text-lg">
                            Nikmati suasana tenang dan kopi terbaik di lokasi kami yang strategis.
                        </p>

                        <div className="flex gap-6 mb-8">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm"><MapPin size={24} /></div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Alamat</h4>
                                <p className="text-xl font-medium text-primary">Jl. Kopi No. 123, Jakarta Selatan</p>
                            </div>
                        </div>

                        <div className="flex gap-6 mb-8">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm"><Clock size={24} /></div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Jam Operasional</h4>
                                <p className="text-xl font-medium text-primary">Setiap Hari: 08:00 - 22:00</p>
                                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-bold ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <span className={`w-2 h-2 rounded-full bg-current ${isOpen ? 'animate-pulse' : ''}`}></span>
                                    {isOpen ? 'Sedang Buka' : 'Tutup'}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="h-[400px] rounded-3xl overflow-hidden shadow-xl"
                    >
                        {/* Placeholder Google Maps Embed */}
                        <iframe
                            title="Location Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.05987163353!2d106.81882!3d-6.25585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMjEuMCJTIDEwNsKwNDknMDguMCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Location;
