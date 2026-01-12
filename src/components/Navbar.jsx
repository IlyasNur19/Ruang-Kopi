import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Coffee } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Story', href: '/story' },
        { title: 'Menu', href: '/menu' },
        { title: 'Gallery', href: '/gallery' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 py-6 transition-all duration-300 ${isScrolled
                    ? 'py-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm'
                    : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <Coffee className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-heading font-bold text-xl text-primary tracking-wide">RUANGKOPI</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.title}
                                to={link.href}
                                className={`font-medium transition-colors hover:text-primary relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${isActive(link.href) ? 'text-primary after:w-full' : 'text-foreground'}`}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <Link
                            to="/reservation"
                            className="py-3 px-6 bg-primary text-white rounded-full font-medium shadow-md transition-all hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Reservation
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-primary p-2"
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
                        className="fixed inset-0 bg-background z-[2000] flex flex-col justify-center items-center gap-8"
                    >
                        <button
                            className="absolute top-6 right-6 text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={40} />
                        </button>

                        {navLinks.map((link) => (
                            <Link
                                key={link.title}
                                to={link.href}
                                className={`font-heading text-4xl font-bold ${isActive(link.href) ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <Link
                            to="/reservation"
                            className="text-xl py-4 px-10 bg-primary text-white rounded-full font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Reservation
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
