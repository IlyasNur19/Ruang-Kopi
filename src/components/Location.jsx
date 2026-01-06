import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import '../styles/Location.css';

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
        <section id="location" className="location-section">
            <div className="container">
                <div className="location-content">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="location-info"
                    >
                        <h2 className="location-title">Kunjungi Kami</h2>
                        <p className="location-desc">
                            Nikmati suasana tenang dan kopi terbaik di lokasi kami yang strategis.
                        </p>

                        <div className="info-item">
                            <div className="icon-box"><MapPin size={24} /></div>
                            <div>
                                <h4 className="info-label">Alamat</h4>
                                <p className="info-text">Jl. Kopi No. 123, Jakarta Selatan</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><Clock size={24} /></div>
                            <div>
                                <h4 className="info-label">Jam Operasional</h4>
                                <p className="info-text">Setiap Hari: 08:00 - 22:00</p>
                                <div className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
                                    <span className="status-indicator"></span>
                                    {isOpen ? 'Sedang Buka' : 'Tutup'}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="map-wrapper"
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
