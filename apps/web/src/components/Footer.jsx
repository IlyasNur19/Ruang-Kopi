import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Instagram, MessageSquare, Smartphone, Lock, ArrowRight } from 'lucide-react';

const Footer = () => {

    return (
        <footer className="bg-[#F5F3F0]">

            {/* Main Footer */}
            <div className="bg-[#3E2723] text-[#D7CCC8] py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <h2 className="font-['Baskervville'] text-4xl font-bold text-white tracking-wider mb-4">ruang kopi</h2>
                            <p className="text-sm leading-relaxed opacity-80">
                                Temukan inspirasi di setiap tegukan. Ruang Kopi hadir sebagai wadah bagi setiap cerita, kolaborasi, dan dedikasi terhadap kopi berkualitas tinggi yang diracik khusus untuk mendukung kreativitasmu.
                            </p>
                        </div>

                        {/* Explore */}
                        <div>
                            <h4 className="font-medium text-white mb-5">Explore</h4>
                            <ul className="space-y-3 text-sm opacity-80">
                                <li><Link to="/" className="hover:text-white hover:opacity-100 transition-colors">Home</Link></li>
                                <li><Link to="/kotak-gagasan" className="hover:text-white hover:opacity-100 transition-colors">Kotak Gagasan</Link></li>
                                <li><Link to="/menu" className="hover:text-white hover:opacity-100 transition-colors">Menu</Link></li>
                                <li><Link to="/gallery" className="hover:text-white hover:opacity-100 transition-colors">Gallery</Link></li>
                                <li><Link to="/reservation" className="hover:text-white hover:opacity-100 transition-colors">Reservations</Link></li>
                            </ul>
                        </div>

                        {/* Visit Us */}
                        <div>
                            <h4 className="font-medium text-white mb-5">Visit Us</h4>
                            <ul className="space-y-4 text-sm opacity-80">
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#8D6E63]" />
                                    <span>Jl. Raya Solo - Tawangmangu, Keprabon, Karangpandan, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Clock size={16} className="shrink-0 text-[#8D6E63]" />
                                    <span>09.00 - 00.00</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="shrink-0 text-[#8D6E63]" />
                                    <span>+62 812 3456 7890</span>
                                </li>
                            </ul>
                        </div>

                        {/* Follow Us */}
                        <div>
                            <h4 className="font-medium text-white mb-5">Follow Us</h4>
                            <div className="flex gap-3 mb-6">
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <MessageSquare size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Smartphone size={18} />
                                </a>
                            </div>
                            <Link to="/admin/login" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                                <Lock size={14} /> Admin Login
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
                        <p>© 2026 RuangKopi. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
