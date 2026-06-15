import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Menu', path: '/menu', icon: 'restaurant_menu' },
  { name: 'About', path: '/kotak-gagasan', icon: 'lightbulb' },
  { name: 'Gallery', path: '/gallery', icon: 'photo_library' },
];

const staffLinks = [
  { name: 'POS', path: '/pos', icon: 'point_of_sale' },
  { name: 'Admin', path: '/admin', icon: 'admin_panel_settings' },
];

const isAuthenticated = () => {
  try {
    return !!localStorage.getItem('ruangkopi_token');
  } catch {
    return false;
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsContactOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close contact dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ====== MAIN NAVBAR ====== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#F5F0EB]/95 backdrop-blur-lg shadow-[0_2px_20px_rgba(62,39,35,0.06)]'
            : 'bg-[#F5F0EB]'
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between pt-4 md:pt-6">

            {/* === LEFT: Logo === */}
            <Link to="/" className="flex items-center gap-0.5 shrink-0 group">
              <span className="font-serif text-[32px] md:text-[40px] font-bold text-[#3E2723] leading-none tracking-tight">
                Ruang
              </span>
              <span className="font-serif text-[32px] md:text-[40px] font-bold text-[#8D6E63] leading-none tracking-tight italic">
                Kopi
              </span>
              <span className="font-serif text-[#8D6E63] text-[32px] md:text-[40px] font-bold leading-none">.</span>
            </Link>

            {/* === CENTER: Desktop Nav Links === */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2 text-[15px] font-medium transition-colors duration-200 rounded-lg ${isActive(item.path)
                      ? 'text-[#3E2723]'
                      : 'text-[#6D4C41] hover:text-[#3E2723] hover:bg-[#3E2723]/5'
                    }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#3E2723] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              ))}
              {/* Staff Links */}
              {isAuthenticated() && staffLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 text-[13px] font-medium text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#8D6E63]/5 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* === RIGHT: Contact Button (Desktop) + Hamburger (Mobile) === */}
            <div className="flex items-center gap-3">
              {/* Contact Dropdown - Desktop */}
              <div className="hidden md:block relative" ref={contactRef}>
                <button
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  className={`flex items-center gap-2 bg-[#3E2723] text-white pl-6 pr-4 py-2.5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#4E342E] transition-all duration-200 active:scale-[0.97] shadow-sm ${isContactOpen ? 'bg-[#4E342E]' : ''
                    }`}
                >
                  Contact
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isContactOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isContactOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#3E2723]/8 overflow-hidden py-2"
                    >
                      <Link
                        to="/reservation"
                        onClick={() => setIsContactOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-[#3E2723] hover:bg-[#F5F0EB] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#8D6E63]">calendar_month</span>
                        Reservasi
                      </Link>
                      <Link
                        to="/location"
                        onClick={() => setIsContactOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-[#3E2723] hover:bg-[#F5F0EB] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#8D6E63]">location_on</span>
                        Lokasi Kami
                      </Link>
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-[#3E2723] hover:bg-[#F5F0EB] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#8D6E63]">chat</span>
                        WhatsApp
                      </a>
                      <div className="border-t border-[#3E2723]/8 mx-4 my-1"></div>
                      <a
                        href="tel:+6281234567890"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-[#3E2723] hover:bg-[#F5F0EB] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-[#8D6E63]">call</span>
                        +62 812 3456 7890
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger - Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-[#3E2723] hover:bg-[#3E2723]/5 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {isMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ====== MOBILE DRAWER ====== */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 left-0 z-[60] bg-[#F5F0EB] h-full w-[85vw] max-w-[320px] shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-0.5">
                  <span className="font-serif text-[28px] font-bold text-[#3E2723] leading-none tracking-tight">Ruang</span>
                  <span className="font-serif text-[28px] font-bold text-[#8D6E63] leading-none tracking-tight italic">Kopi</span>
                  <span className="font-serif text-[#8D6E63] text-[28px] font-bold leading-none">.</span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-[#6D4C41] hover:bg-[#3E2723]/5 transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {/* Divider */}
              <div className="mx-6 border-t border-[#3E2723]/10 mb-2"></div>

              {/* Nav Items */}
              <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05, ease: 'easeOut' }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive(item.path)
                          ? 'bg-[#3E2723] text-white shadow-sm'
                          : 'text-[#5D4037] hover:bg-[#3E2723]/5 hover:text-[#3E2723]'
                        }`}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Extra mobile links */}
                <div className="pt-3 mt-3 border-t border-[#3E2723]/10 space-y-1">
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, ease: 'easeOut' }}
                  >
                    <Link
                      to="/location"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#5D4037] hover:bg-[#3E2723]/5 hover:text-[#3E2723] transition-all"
                    >
                      <span className="material-symbols-outlined text-[22px]">location_on</span>
                      Lokasi
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, ease: 'easeOut' }}
                  >
                    <a
                      href="tel:+6281234567890"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#5D4037] hover:bg-[#3E2723]/5 hover:text-[#3E2723] transition-all"
                    >
                      <span className="material-symbols-outlined text-[22px]">call</span>
                      Hubungi Kami
                    </a>
                  </motion.div>
                </div>
              </nav>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-6 pt-2"
              >
                <Link
                  to="/reservation"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#3E2723] text-white py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#4E342E] transition-all active:scale-[0.97] shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Reservasi Sekarang
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
