import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Instagram, Twitter, Facebook, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#2D2420] text-[#D7CCC8] py-24 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Coffee size={32} className="text-white" />
                            <span className="font-heading text-2xl text-white font-bold">RUANGKOPI</span>
                        </div>
                        <p className="leading-relaxed opacity-80 max-w-xs">
                            Menghadirkan cerita di setiap tegukan kopi terbaik nusantara.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 opacity-80">
                        <h4 className="text-white font-heading text-xl mb-2 font-bold">Navigasi</h4>
                        <Link to="/menu" className="hover:text-white hover:opacity-100 transition-colors">Menu</Link>
                        <Link to="/story" className="hover:text-white hover:opacity-100 transition-colors">Story</Link>
                        <Link to="/gallery" className="hover:text-white hover:opacity-100 transition-colors">Gallery</Link>
                        <Link to="/reservation" className="hover:text-white hover:opacity-100 transition-colors">Reservasi</Link>
                        <Link to="/location" className="hover:text-white hover:opacity-100 transition-colors">Utama/Peta</Link>
                    </div>

                    <div>
                        <h4 className="text-white font-heading text-xl mb-6 font-bold">Kunjungi Kami</h4>
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <MapPin size={20} />
                            <span>Jl. Kopi No. 123, Kota Kopi</span>
                        </div>
                        <p className="opacity-80 leading-relaxed">
                            Buka Setiap Hari<br />
                            08:00 - 22:00
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-heading text-xl mb-6 font-bold">Social</h4>
                        <div className="flex gap-6">
                            <a href="#" className="opacity-80 hover:text-white hover:opacity-100 hover:-translate-y-1 transition-all"><Instagram size={24} /></a>
                            <a href="#" className="opacity-80 hover:text-white hover:opacity-100 hover:-translate-y-1 transition-all"><Twitter size={24} /></a>
                            <a href="#" className="opacity-80 hover:text-white hover:opacity-100 hover:-translate-y-1 transition-all"><Facebook size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-white/5 text-sm opacity-50">
                    <p>&copy; 2026 RuangKopi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
