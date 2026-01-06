import React from 'react';
import { Coffee, Instagram, Twitter, Facebook, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="flex items-center gap-2 mb-4">
                            <Coffee size={32} className="text-primary" />
                            <span className="footer-logo-text">RUANGKOPI</span>
                        </div>
                        <p className="footer-tagline">
                            Menghadirkan cerita di setiap tegukan kopi terbaik nusantara.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Navigasi</h4>
                        <a href="#menu">Menu</a>
                        <a href="#story">Story</a>
                        <a href="#gallery">Gallery</a>
                        <a href="#reservation">Reservasi</a>
                    </div>

                    <div className="footer-contact">
                        <h4 className="footer-heading">Kunjungi Kami</h4>
                        <div className="contact-item">
                            <MapPin size={20} />
                            <span>Jl. Kopi No. 123, Kota Kopi</span>
                        </div>
                        <p className="footer-hours">
                            Buka Setiap Hari<br />
                            08:00 - 22:00
                        </p>
                    </div>

                    <div className="footer-social">
                        <h4 className="footer-heading">Social</h4>
                        <div className="social-icons">
                            <a href="#"><Instagram size={24} /></a>
                            <a href="#"><Twitter size={24} /></a>
                            <a href="#"><Facebook size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 RuangKopi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
