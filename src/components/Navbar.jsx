import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Coffee } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Story', href: '#story' },
        { title: 'Menu', href: '#menu' },
        { title: 'Gallery', href: '#gallery' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            >
                <div className="container nav-container">
                    {/* Logo */}
                    <a href="/" className="logo-link">
                        <Coffee className="logo-icon" />
                        <span className="logo-text">RUANGKOPI</span>
                    </a>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <a key={link.title} href={link.href} className="nav-link">
                                {link.title}
                            </a>
                        ))}
                        <a href="#reservation" className="btn-reservation">
                            Reservation
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="mobile-menu-overlay"
                    >
                        <button
                            className="close-btn"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={40} />
                        </button>

                        {navLinks.map((link) => (
                            <a
                                key={link.title}
                                href={link.href}
                                className="mobile-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.title}
                            </a>
                        ))}
                        <a
                            href="#reservation"
                            className="btn-reservation mobile-btn"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Reservation
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
