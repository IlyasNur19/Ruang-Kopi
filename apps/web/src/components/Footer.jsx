import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary text-on-primary w-full py-section-gap px-margin-mobile md:px-margin-desktop">
            <div className="max-w-container-max-width mx-auto">
                {}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                    {}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="material-symbols-outlined text-primary-fixed text-3xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                coffee
                            </span>
                            <span className="font-headline text-headline-md text-primary-fixed font-bold">
                                RuangKopi
                            </span>
                        </div>
                        <p className="font-body text-body-sm text-on-primary/80 max-w-xs mb-6">
                            Membawa Ketenangan ke Cangkir Anda. Kopi artisanal di jantung kota.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                            </button>
                            <button
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Music"
                            >
                                <span className="material-symbols-outlined text-xl">music_note</span>
                            </button>
                        </div>
                    </div>

                    {}
                    <div>
                        <h4 className="font-body text-label-md text-primary-fixed mb-6 uppercase tracking-wider">
                            Navigasi
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="font-body text-body-sm text-on-primary font-bold">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link to="/kotak-gagasan" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Kotak Gagasan
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {}
                    <div>
                        <h4 className="font-body text-label-md text-primary-fixed mb-6 uppercase tracking-wider">
                            Informasi
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/location" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Location
                                </Link>
                            </li>
                            <li>
                                <a href="#hours" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Hours
                                </a>
                            </li>
                            <li>
                                <a href="#privacy" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="font-body text-body-sm text-on-primary/70 hover:text-on-primary transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {}
                    <div>
                        <h4 className="font-body text-label-md text-primary-fixed mb-6 uppercase tracking-wider">
                            Lokasi &amp; Jam Buka
                        </h4>
                        <p className="font-body text-body-sm text-on-primary/80 mb-4">
                            Jl. Raya Solo - Tawangmangu, Keprabon, Karangpandan, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791
                        </p>
                        <p className="font-body text-body-sm text-on-primary/80">
                            Senin - Minggu
                        </p>
                        <p className="font-body text-body-sm text-on-primary/80">
                            09.00 - 00.00 WIB
                        </p>
                        <button className="bg-white/10 hover:bg-white/20 text-on-primary w-full py-2.5 rounded-full mt-4 flex items-center justify-center gap-2 transition-colors border border-white/20">
                            <span className="material-symbols-outlined text-xl">map</span>
                            <span className="font-body text-body-sm">Arahkan Peta</span>
                        </button>
                    </div>
                </div>

                {}
                <div className="max-w-container-max-width mx-auto mt-16 pt-8 border-t border-white/10 text-center">
                    <p className="font-body text-body-sm text-on-primary/50">
                        © 2026 RuangKopi Artisanal Coffee. All rights reserved.
                    </p>
                    <Link
                        to="/admin/login"
                        className="inline-flex items-center gap-1.5 font-body text-body-sm text-on-primary/30 hover:text-on-primary/50 transition-colors mt-3"
                    >
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
